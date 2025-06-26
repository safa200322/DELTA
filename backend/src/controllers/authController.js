const db = require('../db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
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
    
    // Check all possible user types in sequence
    
    // Check if user is an admin
    const admin = await adminModel.findByPhone(phone);
    if (admin && admin.Password) {
      const isValidPassword = await bcrypt.compare(pass, admin.Password);
      if (isValidPassword) {
        const token = jwt.sign(
          { id: admin.AdminID, role: 'admin', type: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        return res.json({
          msg: "Admin login successful",
          token,
          user: {
            id: admin.AdminID,
            name: admin.Name,
            type: 'admin',
            phone: admin.PhoneNumber
          },
          redirectTo: '/admin/dashboard'
        });
      }
    }
    
    // Check if user is a chauffeur
    const chauffeurModel = require('../models/chauffeurModel');
    const chauffeur = await chauffeurModel.findByPhone(phone);
    if (chauffeur && chauffeur.Password) {
      const isValidPassword = await bcrypt.compare(pass, chauffeur.Password);
      if (isValidPassword) {
        const token = jwt.sign(
          { id: chauffeur.ChauffeurID, role: 'chauffeur', type: 'chauffeur' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        return res.json({
          msg: "Chauffeur login successful",
          token,
          user: {
            id: chauffeur.ChauffeurID,
            name: chauffeur.Name,
            type: 'chauffeur',
            phone: chauffeur.PhoneNumber
          },
          redirectTo: '/chauffeur/dashboard'
        });
      }
    }
    
    // Check if user is a vehicle owner
    const vehicleOwnerModel = require('../models/vehicleOwnerModel');
    const vehicleOwner = await vehicleOwnerModel.getOwnerByPhone(phone);
    if (vehicleOwner && vehicleOwner.PasswordHash) {
      const isValidPassword = await bcrypt.compare(pass, vehicleOwner.PasswordHash);
      if (isValidPassword) {
        const token = jwt.sign(
          { id: vehicleOwner.OwnerID, role: 'vehicle-owner', type: 'vehicle-owner' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        return res.json({
          msg: "Vehicle Owner login successful",
          token,
          user: {
            id: vehicleOwner.OwnerID,
            name: vehicleOwner.FullName,
            type: 'vehicle-owner',
            phone: vehicleOwner.PhoneNumber
          },
          redirectTo: '/vehicle-owner/profile'
        });
      }
    }
    
    // Check if user is a regular user
    const user = await userModel.findByPhone(phone);
    if (user && user.Password) {
      const isValidPassword = await bcrypt.compare(pass, user.Password);
      if (isValidPassword) {
        const token = jwt.sign(
          { id: user.UserID, role: 'user', type: 'user' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        return res.json({
          msg: "User login successful",
          token,
          user: {
            id: user.UserID,
            name: user.Name,
            type: 'user',
            phone: user.PhoneNumber,
            profilePictureUrl: user.ProfilePictureUrl
          },
          redirectTo: '/profile'
        });
      }
    }

    // If we get here, no valid user was found or password did not match
    return res.status(401).json({ err: "Invalid credentials" });
    
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
      return res.status(400).json({ err: 'invalid admin' });
    }

    if (!admin) {
      res.status(400).json({ err: "no admin" });
      return;
    }

    if (!admin.Password) {
      res.status(500).json({ err: "admin data invalid" });
      return;
    }

    const ok = await bcrypt.compare(pwd, admin.Password);
    if (!ok) {
      res.status(401).json({ err: "bad pwd" });
      return;
    }

    const token = jwt.sign(
      { id: admin.AdminID, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '100h' }
    );

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
    // req.user is set by the authenticateToken middleware
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set default profile picture URL if none exists
    const profilePictureUrl = user.ProfilePictureUrl ||
      `${req.protocol}://${req.get('host')}/uploads/profile-pictures/default.svg`;

    // Return user data without sensitive information
    res.status(200).json({
      id: user.UserID,
      fullName: user.Name,
      username: user.Username || user.Name,
      email: user.Email,
      phone: user.PhoneNumber,
      birthday: user.Date_of_birth,
      profilePictureUrl: profilePictureUrl,
      isVerified: !!user.isVerified
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create the URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profilePictureUrl = `${baseUrl}/uploads/profile-pictures/${req.file.filename}`;

    // Update the user's profile picture URL in the database
    await userModel.updateProfilePicture(userId, profilePictureUrl);

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
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if email is already used by another user
    const existingUser = await userModel.findByEmail(email);
    if (existingUser && existingUser.UserID !== userId) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Update user profile
    await userModel.updateUserProfile(userId, {
      name: fullName,
      email: email,
      phone: phone
    });

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
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    // Get current user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.Password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await userModel.updatePassword(userId, hashedNewPassword);

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

    // Delete user account
    await userModel.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Server error" });
  }
};
