const db = require('../db');  // ✅ Add this if missing
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
require('dotenv').config();

// Register user
exports.registerUser = async (req, res) => {
    try {
        const { Name, PhoneNumber, Email, Password } = req.body;

        if (!Name || !PhoneNumber || !Email) {
            return res.status(400).json({ error: "Name, Phone Number, and Email are required." });
        }

        if (!Password) {
            return res.status(400).json({ error: "Password is required for manual registration." });
        }

        const existingUser = await new Promise((resolve, reject) => {
            User.findUserByEmail(Email, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create new user
        await new Promise((resolve, reject) => {
            User.createUser(Name, PhoneNumber, Email, hashedPassword, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        const newUser = await new Promise((resolve, reject) => {
            User.findUserByEmail(Email, (err, user) => {
                if (err) reject(err);
                resolve(user);
            });
        });

        // ✅ Send welcome notification
        await Notification.create({
            title: 'Welcome to DELTA!',
            message: 'Thank you for registering. You can now make reservations and access your dashboard.',
            type: 'Registration',
            userId: newUser.id
        });

        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
