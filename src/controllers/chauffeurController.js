const db = require("../db");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");

// Add a new chauffeur (registration)
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

      // Notify Admin
      await Notification.create({
        title: "New Chauffeur Application",
        message: `${Name} has applied to be a chauffeur.`,
        type: "Chauffeur",
        userId: null
      });

      // Notify Chauffeur
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

// Assign a chauffeur to a reservation
exports.assignChauffeur = (req, res) => {
  const { reservationId, chauffeurId } = req.body;

  const checkChauffeurQuery = `
    SELECT * FROM Chauffeur WHERE ChauffeurID = ? AND Status = 'Approved'
  `;
  db.query(checkChauffeurQuery, [chauffeurId], (err, chauffeurResult) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (chauffeurResult.length === 0) {
      return res.status(404).json({ message: "Chauffeur not found or not approved" });
    }

    const updateReservationQuery = `
      UPDATE Reservation SET ChauffeurID = ? WHERE ReservationID = ?
    `;
    db.query(updateReservationQuery, [chauffeurId, reservationId], (err, result) => {
      if (err) return res.status(500).json({ message: "Error assigning chauffeur", error: err });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      const notifyQuery = `
        INSERT INTO Notification (UserID, Title, Message, Type, Status)
        VALUES (?, 'Chauffeur Assignment', 'You have been assigned to a new reservation.', 'Chauffeur', 'Unread')
      `;
      db.query(notifyQuery, [chauffeurId]);

      res.status(200).json({ message: "Chauffeur assigned and notification sent." });
    });
  });
};

// Approve or reject a chauffeur application
exports.updateChauffeurStatus = (req, res) => {
  const { id } = req.params; // ChauffeurID
  const { status } = req.body; // 'Approved' or 'Rejected'

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Must be 'Approved' or 'Rejected'." });
  }

  const updateQuery = "UPDATE Chauffeur SET Status = ? WHERE ChauffeurID = ?";
  db.query(updateQuery, [status, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating status", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Chauffeur not found" });

    const title = status === 'Approved' ? 'Application Approved' : 'Application Rejected';
    const message = status === 'Approved'
      ? 'Congratulations! Your chauffeur application has been approved.'
      : 'Unfortunately, your chauffeur application was rejected.';

    const notifyQuery = `
      INSERT INTO Notification (UserID, Title, Message, Type, Status)
      VALUES (?, ?, ?, 'Chauffeur', 'Unread')
    `;
    db.query(notifyQuery, [id, title, message]);

    res.status(200).json({ message: `Chauffeur status updated to '${status}' and notification sent.` });
  });
};
