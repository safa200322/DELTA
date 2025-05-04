const db = require('../db');

// Create a reservation
exports.createReservation = (req, res) => {
  const { VehicleID, StartDate, EndDate, PickupLocation, DropoffLocation, LicenseID } = req.body;
  const UserID = req.user.id;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ message: "Failed to start transaction", error: err });

    const insertReservationQuery = `
      INSERT INTO Reservation (UserID, VehicleID, LicenseID, StartDate, EndDate, PickupLocation, DropoffLocation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertReservationQuery, [UserID, VehicleID, LicenseID, StartDate, EndDate, PickupLocation, DropoffLocation], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ message: "Failed to create reservation", error: err }));
      }

      const updateVehicleQuery = "UPDATE Vehicle SET Status = 'Rented' WHERE VehicleID = ?";
      db.query(updateVehicleQuery, [VehicleID], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ message: "Failed to update vehicle status", error: err }));
        }

        const notifyUserQuery = `
          INSERT INTO Notification (UserID, Title, Message)
          VALUES (?, 'Reservation Created', 'Your reservation has been successfully created.')
        `;
        db.query(notifyUserQuery, [UserID], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ message: "Failed to create user notification", error: err }));
          }

          const notifyAdminQuery = `
            INSERT INTO Notification (UserID, Title, Message)
            VALUES (?, 'New Reservation', 'A new reservation has been made by user ID ${UserID}.')
          `;
          db.query(notifyAdminQuery, [1], (err) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ message: "Failed to create admin notification", error: err }));
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => res.status(500).json({ message: "Failed to commit transaction", error: err }));
              }

              res.status(201).json({ message: "Reservation created, vehicle updated, and notifications sent." });
            });
          });
        });
      });
    });
  });
};

// Cancel a reservation
exports.cancelReservation = (req, res) => {
  const { id } = req.params;
  const UserID = req.user.id;

  const checkQuery = "SELECT * FROM Reservation WHERE ReservationID = ? AND UserID = ?";
  db.query(checkQuery, [id, UserID], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Reservation not found or access denied" });

    const vehicleId = results[0].VehicleID;

    const deleteQuery = "DELETE FROM Reservation WHERE ReservationID = ?";
    db.query(deleteQuery, [id], (err) => {
      if (err) return res.status(500).json({ message: "Error canceling reservation", error: err });

      db.query("UPDATE Vehicle SET Status = 'Available' WHERE VehicleID = ?", [vehicleId]);

      const notifyQuery = `
        INSERT INTO Notification (UserID, Title, Message)
        VALUES (?, 'Reservation Cancelled', 'Your reservation has been cancelled successfully.')
      `;
      db.query(notifyQuery, [UserID]);

      res.status(200).json({ message: "Reservation cancelled and notification sent." });
    });
  });
};

// Update a reservation
exports.updateReservation = (req, res) => {
  const { id } = req.params;
  const UserID = req.user.id;
  const { StartDate, EndDate, PickupLocation, DropoffLocation } = req.body;

  const checkQuery = "SELECT * FROM Reservation WHERE ReservationID = ? AND UserID = ?";
  db.query(checkQuery, [id, UserID], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Reservation not found or access denied" });

    const updateQuery = `
      UPDATE Reservation
      SET StartDate = ?, EndDate = ?, PickupLocation = ?, DropoffLocation = ?
      WHERE ReservationID = ?
    `;
    db.query(updateQuery, [StartDate, EndDate, PickupLocation, DropoffLocation, id], (err) => {
      if (err) return res.status(500).json({ message: "Error updating reservation", error: err });

      const notifyQuery = `
        INSERT INTO Notification (UserID, Title, Message)
        VALUES (?, 'Reservation Updated', 'Your reservation has been updated.')
      `;
      db.query(notifyQuery, [UserID]);

      res.status(200).json({ message: "Reservation updated and notification sent." });
    });
  });
};
