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
          INSERT INTO Notification (UserID, Title, Message, Type, Status)
          VALUES (?, 'Reservation Created', 'Your reservation has been successfully created.', 'Reservation', 'Unread')
        `;
        db.query(notifyUserQuery, [UserID], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ message: "Failed to create user notification", error: err }));
          }

          const notifyAdminQuery = `
            INSERT INTO Notification (UserID, Title, Message, Type, Status)
            VALUES (?, 'New Reservation', 'A new reservation has been made by user ID ${UserID}.', 'Reservation', 'Unread')
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

      const notifyUserQuery = `
        INSERT INTO Notification (UserID, Title, Message, Type, Status)
        VALUES (?, 'Reservation Cancelled', 'Your reservation has been cancelled successfully.', 'Reservation', 'Unread')
      `;
      db.query(notifyUserQuery, [UserID]);

      const notifyAdminCancel = `
        INSERT INTO Notification (UserID, Title, Message, Type, Status)
        VALUES (?, 'Reservation Cancelled', 'User ID ${UserID} cancelled their reservation #${id}.', 'Reservation', 'Unread')
      `;
      db.query(notifyAdminCancel, [1]);

      res.status(200).json({ message: "Reservation cancelled and notifications sent." });
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
        INSERT INTO Notification (UserID, Title, Message, Type, Status)
        VALUES (?, 'Reservation Updated', 'Your reservation has been updated.', 'Reservation', 'Unread')
      `;
      db.query(notifyQuery, [UserID]);

      res.status(200).json({ message: "Reservation updated and notification sent." });
    });
  });
};

// Complete a reservation
exports.completeReservation = (req, res) => {
  const { id } = req.params;
  const UserID = req.user.id;

  const findQuery = "SELECT * FROM Reservation WHERE ReservationID = ?";
  db.query(findQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Reservation not found" });

    const reservation = result[0];

    if (req.user.role !== 'admin' && reservation.UserID !== UserID) {
      return res.status(403).json({ message: "You are not allowed to complete this reservation." });
    }

    const vehicleId = reservation.VehicleID;

    db.query("UPDATE Vehicle SET Status = 'Available' WHERE VehicleID = ?", [vehicleId]);

    const notifyQuery = `
      INSERT INTO Notification (UserID, Title, Message, Type, Status)
      VALUES (?, 'Rental Completed', 'Your rental has been completed. Thank you for using our service.', 'Reservation', 'Unread')
    `;
    db.query(notifyQuery, [reservation.UserID]);

    res.status(200).json({ message: "Reservation completed and notification sent." });
  });
};
