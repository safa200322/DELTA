
const db = require('../db');  // 
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Register user
exports.registerUser = async (req, res) => {
    try {
        const { Name, PhoneNumber, Email, Password } = req.body;

        if (!Name || !PhoneNumber || !Email) {
            return res.status(400).json({ error: "Name, Phone Number, and Email are required." });
        }

        // registers
        if (!Password) {
            return res.status(400).json({ error: "Password is required for manual registration." });
        }

        // Check if the user already exists
        const existingUser = await new Promise((resolve, reject) => {
            User.findUserByEmail(Email, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create the new user
        await new Promise((resolve, reject) => {
            User.createUser(Name, PhoneNumber, Email, hashedPassword, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        res.status(201).json({ message: "User registered successfully." });

    } catch (err) {
        console.error("Registration Error:", err.sqlMessage || err.message || err);
        res.status(500).json({ message: "Error registering user", error: err.sqlMessage || err.message || err });
    }
};


// Login user
exports.loginUser = async (req, res) => {
    try {
        const { PhoneNumber, Password } = req.body;

        if (!PhoneNumber || !Password) {
            return res.status(400).json({ error: "Phone number and password are required" });
        }

        // Fetch user using Promise instead of callback
        const user = await new Promise((resolve, reject) => {
            User.findUserByPhone(PhoneNumber, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        // If no user is found, return an error
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.UserID, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { id: user.UserID, name: user.Name, phone: user.PhoneNumber } 
        });

    } catch (err) {
        console.error(' Login Error:', err.message || err);
        res.status(500).json({ message: "Error logging in", error: err.message || err });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { PhoneNumber, Password } = req.body;

        if (!PhoneNumber || !Password) {
            return res.status(400).json({ error: "Phone number and password are required" });
        }

        // Find admin by phone number
        const admin = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Admin WHERE PhoneNumber = ?', [PhoneNumber], (err, result) => {
                if (err) reject(err);
                resolve(result[0]);
            });
        });

        // If admin not found
        if (!admin) {
            return res.status(400).json({ error: "Admin not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(Password, admin.Password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.AdminID, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({
            message: "Admin login successful",
            token,
            admin: { id: admin.AdminID, name: admin.Name, phone: admin.PhoneNumber }
        });

    } catch (err) {
        console.error('Admin Login Error:', err.message || err);
        res.status(500).json({ message: "Error logging in", error: err.message || err });
    }
};
