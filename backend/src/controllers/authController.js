const db = require('../db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const { findUserAcrossTypes, verifyPassword, updatePassword, deleteUser, updateUserProfile: updateUserProfileUnified, updateProfilePicture: updateProfilePictureUnified } = require('../utils/userUtils');
require('dotenv').config();

exports.registerUser = async (req, res) => {
  try {
    const b = req.body
    const name = b.fullName
    const phone = b.phone
    const email = b.email
    const pass = b.password
    const birthday = b.birthday

    if (!name || !phone || !pass || !birthday || !email) {
      res.status(400).json({ err: 'missing stuff' })
      return
    }

    const dob = new Date(birthday)
    if (isNaN(dob)) {
      res.status(400).json({ err: 'wring date format' })
      return
    }

    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    if (dob.getMonth() > today.getMonth() || (dob.getMonth() === today.getMonth() && dob.getDate() > today.getDate())) {
      age--
    }

    if (age < 22) {
      res.status(400).json({ err: '22 minimum age' })
      return
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ err: 'email exists' });
    }

    const hashed = await bcrypt.hash(pass, 10)

    await userModel.createUser({
      name,
      phone,
      email,
      hashedPassword: hashed,
      dob: dob.toISOString().split('T')[0],
    });

    res.status(201).json({ success: true })

  } catch (err) {
    console.log('error reg:', err)
    res.status(500).json({ err: 'smth went wrong serever prob' })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const phone = req.body.phonenumber;
    const pass = req.body.password;

    if (!phone || !pass) {
      return res.status(400).json({ err: "Missing credentials" });
    }

    // Use unified user lookup
    const user = await findUserAcrossTypes(phone, 'phone');

    if (!user) {
      console.log('[UNIFIED LOGIN] No user found for phone:', phone);
      return res.status(401).json({ err: "Invalid credentials" });
    }

    // Log both the input password and the hashed password from DB (if available)
    console.log('[UNIFIED LOGIN] Comparing passwords:', {
      inputPassword: pass,
      hashedPassword: user.password || user.Password || user.hashedPassword || 'N/A',
      userType: user.type
    });

    // Verify password
    const isValidPassword = await verifyPassword(pass, user);
    if (!isValidPassword) {
      console.log('[UNIFIED LOGIN] Password mismatch for:', phone, 'type:', user.type);
      return res.status(401).json({ err: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Determine redirect URL based on user type
    const redirectPaths = {
      'admin': '/admin',
      'chauffeur': '/chauffeur/dashboard',
      'vehicle-owner': '/vehicle-owner/profile',
      'user': '/profile'
    };

    console.log('[UNIFIED LOGIN] Login successful for:', phone, 'type:', user.type);

    return res.json({
      msg: `${user.type.charAt(0).toUpperCase() + user.type.slice(1)} login successful`,
      token,
      user: {
        id: user.id,
        name: user.name,
        type: user.type,
        phone: user.phone,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl
      },
      redirectTo: redirectPaths[user.type] || '/profile'
    });

  } catch (e) {
    console.log("Error during login:", e);
    res.status(500).json({ err: "Server error during login" });
  }
}


exports.adminLogin = async (req, res) => {
  try {
    const phone = req.body.phonenumber;
    const pwd = req.body.password;

    if (!phone || !pwd) {
      res.status(400).json({ err: "missing creds" });
      return;
    }

    const admin = await adminModel.findByPhone(phone);
    if (!admin || !admin.Password) {
      console.log('[ADMIN LOGIN] Admin not found or missing password:', phone);
      return res.status(400).json({ err: 'invalid admin' });
    }

    if (!admin) {
      console.log('[ADMIN LOGIN] No admin found for phone:', phone);
      res.status(400).json({ err: "no admin" });
      return;
    }

    if (!admin.Password) {
      console.log('[ADMIN LOGIN] Admin data invalid (no password) for:', phone);
      res.status(500).json({ err: "admin data invalid" });
      return;
    }

    // Log both the input password and the hashed password from DB
    console.log('[ADMIN LOGIN] Comparing passwords:', {
      inputPassword: pwd,
      hashedPassword: admin.Password
    });

    const ok = await bcrypt.compare(pwd, admin.Password);
    if (!ok) {
      console.log('[ADMIN LOGIN] Password mismatch for:', phone);
      res.status(401).json({ err: "bad pwd" });
      return;
    }

    const token = jwt.sign(
      { id: admin.AdminID, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '100h' }
    );

    console.log('[ADMIN LOGIN] Admin login successful:', phone);

    res.status(200).json({
      msg: "admin ok",
      token,
      admin: {
        id: admin.AdminID,
        name: admin.Name,
        phone: admin.PhoneNumber
      }
    });

  } catch (e) {
    console.log("err admin login:", e);
    res.status(500).json({ err: "admin login crash" });
  }
}

exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    if (!userId || !userType) {
      return res.status(400).json({ error: "Invalid user ID or type" });
    }

    // Use userType to select the correct table/model
    let user;
    switch (userType) {
      case 'vehicle-owner':
        user = await require('../models/vehicleOwnerModel').findById(userId);
        break;
      case 'user':
        user = await require('../models/userModel').findById(userId);
        break;
      case 'chauffeur':
        user = await require('../models/chauffeurModel').findById(userId);
        break;
      case 'admin':
        user = await require('../models/adminModel').findById(userId);
        break;
      default:
        return res.status(400).json({ error: "Unknown user type" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set default profile picture URL if none exists
    let profilePictureUrl = null;

    // Handle different profile picture fields for different user types
    switch (user.type) {
      case 'vehicle-owner':
        profilePictureUrl = user.ProfileImage;
        break;
      case 'user':
        profilePictureUrl = user.ProfilePictureUrl || user.profilePictureUrl;
        break;
      case 'chauffeur':
      case 'admin':
        profilePictureUrl = user.ProfilePictureUrl;
        break;
    }

    // Set default if no profile picture
    if (!profilePictureUrl) {
      profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profile-pictures/default.svg`;
    }

    // Return user data without sensitive information
    res.status(200).json({
      id: user.id || user.UserID || user.VehicleOwnerID || user.ChauffeurID || user.AdminID,
      fullName: user.name || user.Name,
      username: user.Username || user.name || user.Name,
      email: user.email || user.Email,
      phone: user.phone || user.PhoneNumber,
      birthday: user.Date_of_birth || user.DateOfBirth || user.Birthday,
      profilePictureUrl: profilePictureUrl,
      isVerified: !!user.isVerified,
      userType: userType,
      role: user.role || userType
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get current user using unified lookup
    const user = await findUserAcrossTypes(userId, 'id');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profilePictureUrl = `${baseUrl}/uploads/profile-pictures/${req.file.filename}`;

    // Update the user's profile picture URL using unified utility
    const success = await updateProfilePictureUnified(user, profilePictureUrl);
    if (!success) {
      return res.status(500).json({ error: "Failed to update profile picture" });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePictureUrl: profilePictureUrl
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get current user using unified lookup
    const user = await findUserAcrossTypes(userId, 'id');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is already used by another user across all user types
    const existingUserByEmail = await findUserAcrossTypes(email, 'email');
    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Update user profile using unified utility
    const success = await updateUserProfileUnified(user, {
      name: fullName,
      email: email,
      phone: phone
    });

    if (!success) {
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    // Get current user using unified lookup
    const user = await findUserAcrossTypes(userId, 'id');
    if (!user || user.type !== userType) {
      return res.status(404).json({ error: "User not found or type mismatch" });
    }

    // Verify current password using unified utility
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password using unified utility
    const success = await updatePassword(user, hashedNewPassword);
    if (!success) {
      return res.status(500).json({ error: "Failed to update password" });
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    // Get current user using unified lookup
    const user = await findUserAcrossTypes(userId, 'id');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user account using unified utility
    const success = await deleteUser(user);
    if (!success) {
      return res.status(500).json({ error: "Failed to delete account" });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Server error" });
  }
};
