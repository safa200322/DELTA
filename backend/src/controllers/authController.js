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
    const phone = req.body.phonenumber
    const pass = req.body.password

    if (!phone || !pass) {
      res.status(400).json({ err: "missing stuff" })
      return
    }
    const user = await userModel.findByPhone(phone);
    if (!user || !user.Password) {
      return res.status(404).json({ err: 'user not found' });
    }

    if (!user) {
      console.log("login fail / user not found:", phone)
      res.status(404).json({ err: "user gone" })
      return
    }
    if (!user.Password) {
        console.log('user.Password is missing:', user)
        return res.status(500).json({ err: 'user data incomplete' })
    }
    const same = await bcrypt.compare(pass, user.Password)



    if (!same) {
      res.status(401).json({ err: "no match" })
      return
    }

    const token = jwt.sign({ id: user.UserID, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '2h' })

    res.json({
      msg: "ok login",
      token,
      user: {
        id: user.UserID,
        name: user.Name,
        phone: user.phonenumber,
        profilePictureUrl: user.ProfilePictureUrl
      }
    })

  } catch (e) {
    console.log("err login:", e)
    res.status(500).json({ err: "server fail" })
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
