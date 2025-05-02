const db = require("../db");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");

exports.addChauffeur = async (req, res) => {
    try {
        const {
            Name, Gender, PhoneNumber, Email, Date_of_birth,
            LicenseNumber, Location, Password
        } = req.body;

        if (!Name || !Gender || !PhoneNumber || !Email || !Date_of_birth || !LicenseNumber || !Location || !Password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const query = `
        INSERT INTO Chauffeur 
        (Name, Gender, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, Password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [Name, Gender, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, hashedPassword], async (err, result) => {
            if (err) {
                console.error("DB Error:", err);
                return res.status(500).json({ message: "Failed to add chauffeur", error: err });
            }

            const newChauffeurId = result.insertId;

            // ✅ Notify Admin
            await Notification.create({
                title: "New Chauffeur Application",
                message: `${Name} has applied to be a chauffeur.`,
                type: "Chauffeur",
                userId: null
            });

            // ✅ Notify Chauffeur
            await Notification.create({
                title: "Chauffeur Application Received",
                message: "You have been registered as a chauffeur. Please wait for admin approval.",
                type: "Chauffeur",
                userId: newChauffeurId
            });

            return res.status(201).json({ message: "Chauffeur added successfully!", ChauffeurID: newChauffeurId });
        });

    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
};
