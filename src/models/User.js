const db = require('../db'); // Assuming db connection is set up in db.js

// Function to find a user by email
exports.findUserByEmail = async (email) => {
    try {
        const [User] = await db.promise().query("SELECT * FROM User WHERE email = ?", [email]);
        return User;
    } catch (err) {
        throw err;
    }
};

// Function to create a new user
exports.createUser = async (name, phoneNumber, email, password, date_of_birth, nationalID, passportNumber) => {
    try {
        const [result] = await db.promise().query(
            "INSERT INTO User (name, phone_number, email, password, date_of_birth, nationalID, passportNumber) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, phoneNumber, email, password, date_of_birth, nationalID, passportNumber]
        );
        return result;
    } catch (err) {
        throw err;
    }
};
