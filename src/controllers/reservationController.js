const db = require('../db');
const Notification = require('../models/Notification');

exports.createReservation = (req, res) => {
  const { VehicleID, StartDate, EndDate, PickupLocation, DropoffLocation, LicenseID } = req.body;
  const UserID = req.user.id; // Extracted from token

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Failed to start transaction", error: err });

    // Insert Reservation
    const insertReservationQuery = `
      INSERT INTO Reservation (UserID, VehicleID, LicenseID, StartDate, EndDate, PickupLocation, DropoffLocation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertReservationQuery, [UserID, VehicleID, LicenseID, StartDate, EndDate, PickupLocation, DropoffLocation], async (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Failed to create reservation", error: err });
        });
      }

      // Update Vehicle status
      const updateVehicleQuery = "UPDATE Vehicle SET Status = 'Rented' WHERE VehicleID = ?";
      db.query(updateVehicleQuery, [VehicleID], async (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Failed to update vehicle status", error: err });
          });
        }

        try {
          // ✅ Send Notification after successful reservation
          await Notification.create({
            title: 'Reservation Confirmed',
            message: `Your reservation from ${StartDate} to ${EndDate} has been confirmed.`,
            type: 'Reservation',
            userId: UserID
          });

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: "Failed to commit transaction", error: err });
              });
            }
            res.status(201).json({ message: "Reservation created successfully" });
          });
        } catch (notifyError) {
          db.rollback(() => {
            res.status(500).json({ message: "Notification failed", error: notifyError });
          });
        }
      });
    });
  });
};
