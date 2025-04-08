const db = require('../db');  // ✅ Ensure correct DB connection
const bcrypt = require('bcryptjs'); // ✅ Use bcryptjs for password hashing

// ✅ Function to create a new user (Manual Registration)
exports.createUser = (name, phoneNumber, email, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => { // ✅ Hash password securely
        if (err) return callback(err, null);
        
        db.query(
            'INSERT INTO User (Name, PhoneNumber, Email, Password) VALUES (?, ?, ?, ?)',
            [name, phoneNumber, email || null, hashedPassword],
            callback
        );
    });
};

// ✅ Function to create a new user via OAuth (Google)
exports.createOAuthUser = (name, email, googleId, callback) => {
    db.query(
        'INSERT INTO User (Name, Email, GoogleID, Password) VALUES (?, ?, ?, NULL)',  // ✅ No password for OAuth users
        [name, email, googleId],
        callback
    );
};

// ✅ Function to find a user by phone number (Manual Login)
exports.findUserByPhone = (phoneNumber, callback) => {
    db.query('SELECT * FROM User WHERE PhoneNumber = ?', [phoneNumber], (err, results) => {
        if (err) return callback(err, null);
        
        if (results.length === 0) {
            return callback(null, null);  // ✅ Ensure returning `null` if no user found
        }
        
        callback(null, results[0]); // ✅ Return first user found
    });
};

// ✅ Function to find a user by email (Used for OAuth Login)
exports.findUserByEmail = (email, callback) => {
    db.query('SELECT * FROM User WHERE Email = ?', [email], (err, results) => {
        if (err) return callback(err, null);
        
        if (results.length === 0) {
            return callback(null, null);  // ✅ Ensure returning `null` if no user found
        }
        
        callback(null, results[0]); // ✅ Return first user found
    });
};

// ✅ Function to find a user by Google ID (For OAuth Login)
exports.findUserByGoogleID = (googleId, callback) => {
    db.query('SELECT * FROM User WHERE GoogleID = ?', [googleId], (err, results) => {
        if (err) return callback(err, null);
        
        if (results.length === 0) {
            return callback(null, null);  // ✅ Ensure returning `null` if no user found
        }
        
        callback(null, results[0]); // ✅ Return first user found
    });
};
