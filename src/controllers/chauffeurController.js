const db = require("../db");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");

// Add Chauffeur (Admin Only)
exports.addChauffeur = async (req, res) => {
    try {
        const {
            Name, Gender, PhoneNumber, Email, Date_of_birth,
            LicenseNumber, Location, Password
        } = req.body;

        // Validate
        if (!Name || !Gender || !PhoneNumber || !Email || !Date_of_birth || !LicenseNumber || !Location || !Password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Insert into DB
        const query = `
        INSERT INTO Chauffeur 
        (Name, Gender, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, Password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        db.query(query, [Name, Gender, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, hashedPassword], async (err, result) => {
            if (err) {
                console.error(" DB Error:", err);
                return res.status(500).json({ message: "Failed to add chauffeur", error: err });
            }

            // ✅ Send Notification to Admin about new chauffeur
            await Notification.create({
                title: "New Chauffeur Application",
                message: `${Name} has applied to be a chauffeur.`,
                type: "Chauffeur",
                userId: null // general notification
            });

            return res.status(201).json({ message: "Chauffeur added successfully!", ChauffeurID: result.insertId });
        });

    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
};
