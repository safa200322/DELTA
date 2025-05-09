const db = require("../db");
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

        db.query(query, [Name, Gender, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, hashedPassword], (err, result) => {
            if (err) {
                console.error(" DB Error:", err);
                return res.status(500).json({ message: "Failed to add chauffeur", error: err });
            }

            return res.status(201).json({ message: "Chauffeur added successfully!", ChauffeurID: result.insertId });
        });

    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ error: err.message });
    }
};


// Assign a chauffeur based on filters
exports.assignChauffeur = async (req, res) => {
    const reservationId = req.params.reservationId;

    try {
        // Get reservation details
        const [reservationResult] = await db.promise().query(
            "SELECT * FROM Reservation WHERE ReservationID = ?", [reservationId]
        );
        if (reservationResult.length === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        const reservation = reservationResult[0];

        // Get user details
        const [userResult] = await db.promise().query(
            "SELECT * FROM User WHERE UserID = ?", [reservation.UserID]
        );
        if (userResult.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = userResult[0];
        const userGender = user.Gender;
        const userBirth = new Date(user.Date_of_birth);

        // Fetch available chauffeurs in the same pickup location and approved
        const [chauffeurs] = await db.promise().query(
            "SELECT * FROM Chauffeur WHERE Availability = 'Available' AND Location = ? AND Status = 'Approved'",
            [reservation.PickupLocation]
        );

        if (chauffeurs.length === 0) {
            return res.status(404).json({ message: "No available chauffeurs found" });
        }

        // Find the best match
        const sorted = chauffeurs.sort((a, b) => {
            const aAge = new Date().getFullYear() - new Date(a.Date_of_birth).getFullYear();
            const bAge = new Date().getFullYear() - new Date(b.Date_of_birth).getFullYear();
            const userAge = new Date().getFullYear() - userBirth.getFullYear();

            const aMatch = a.Gender === userGender;
            const bMatch = b.Gender === userGender;

            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;

            return Math.abs(aAge - userAge) - Math.abs(bAge - userAge);
        });

        const selectedChauffeur = sorted[0];

        // Assign chauffeur and mark as unavailable
        await db.promise().query(
            "UPDATE Reservation SET ChauffeurID = ?, LicenseID = NULL WHERE ReservationID = ?",
            [selectedChauffeur.ChauffeurID, reservationId]
          );
          
        await db.promise().query(
            "UPDATE Chauffeur SET Availability = 'Unavailable' WHERE ChauffeurID = ?",
            [selectedChauffeur.ChauffeurID]
        );

        return res.status(200).json({
            message: "Chauffeur assigned successfully",
            chauffeur: {
                id: selectedChauffeur.ChauffeurID,
                name: selectedChauffeur.Name
            }
        });

    } catch (err) {
        console.error(" Error assigning chauffeur:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};


// Fetch chauffeurs waiting for approval
exports.getPendingChauffeurs = (req, res) => {
  const sql = "SELECT * FROM Chauffeur WHERE Status = 'Pending'";

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('DB error while fetching pending chauffeurs:', err);
      return res.status(500).json({ error: 'Something went wrong.' });
    }

    res.json(rows);
  });
};






// Approve a chauffeur by ID
exports.approveChauffeur = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing chauffeur ID' });
  }

  const sql = "UPDATE Chauffeur SET Status = 'Approved' WHERE ChauffeurID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('DB error while approving chauffeur:', err);
      return res.status(500).json({ error: 'Could not approve chauffeur.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }

    res.json({ message: 'Chauffeur approved.' });
  });
};



// Reject a chauffeur by ID
exports.rejectChauffeur = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing chauffeur ID' });
  }

  const sql = "UPDATE Chauffeur SET Status = 'Rejected' WHERE ChauffeurID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('DB error while rejecting chauffeur:', err);
      return res.status(500).json({ error: 'Could not reject chauffeur.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }

    res.json({ message: 'Chauffeur rejected.' });
  });
};




//to accept or reject the ride
exports.respondToAssignment = (req, res) => {
  const { reservationId } = req.params;
  const { response } = req.body; // 'Accepted' or 'Rejected'

  if (!['Accepted', 'Rejected'].includes(response)) {
    return res.status(400).json({ message: "Invalid response. Must be 'Accepted' or 'Rejected'" });
  }

  const query = `
    UPDATE Reservation
    SET ResponseStatus = ?
    WHERE ReservationID = ?
  `;

  db.query(query, [response, reservationId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating response", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // If rejected, make chauffeur available again
    if (response === 'Rejected') {
      const releaseQuery = `
        UPDATE Chauffeur
        SET Availability = 'Available'
        WHERE ChauffeurID = (
          SELECT ChauffeurID FROM Reservation WHERE ReservationID = ?
        )
      `;
      db.query(releaseQuery, [reservationId], () => {});
    }

    res.status(200).json({ message: `Reservation ${response.toLowerCase()} successfully.` });
  });
};




// list all reservations where this chauffeur was assigned but hasn't responded yet
exports.getPendingAssignments = (req, res) => {
  const { chauffeurId } = req.params;

  const query = `
    SELECT 
      r.*,
      u.Name AS RenterName,
      u.PhoneNumber,
      TIMESTAMPDIFF(HOUR, r.StartDate, r.EndDate) AS DurationHours
    FROM Reservation r
    JOIN User u ON r.UserID = u.UserID
    WHERE r.ChauffeurID = ? AND r.ResponseStatus IS NULL
  `;

  db.query(query, [chauffeurId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching assignments", error: err });
    res.status(200).json(results);
  });
};
