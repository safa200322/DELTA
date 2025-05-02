const db = require('../db');

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
    db.query(insertReservationQuery, [UserID, VehicleID, LicenseID, StartDate, EndDate, PickupLocation, DropoffLocation], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: "Failed to create reservation", error: err });
        });
      }

      // Update Vehicle status
      const updateVehicleQuery = "UPDATE Vehicle SET Status = 'Rented' WHERE VehicleID = ?";
      db.query(updateVehicleQuery, [VehicleID], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: "Failed to update vehicle status", error: err });
          });
        }

        // Add notifications (User + Admin)
        const notifyUserQuery = `
          INSERT INTO Notification (UserID, Title, Message)
          VALUES (?, 'Reservation Created', 'Your reservation has been successfully created.')
        `;
        db.query(notifyUserQuery, [UserID], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: "Failed to create user notification", error: err });
            });
          }

          // Optional: Notify Admin (Assuming admin has UserID = 1)
          const notifyAdminQuery = `
            INSERT INTO Notification (UserID, Title, Message)
            VALUES (?, 'New Reservation', 'A new reservation has been made by user ID ${UserID}.')
          `;
          db.query(notifyAdminQuery, [1], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ message: "Failed to create admin notification", error: err });
              });
            }

            // Commit final transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ message: "Failed to commit transaction", error: err });
                });
              }

              res.status(201).json({ message: "Reservation created, vehicle updated, and notifications sent." });
            });
          });
        });
      });
    });
  });
};
