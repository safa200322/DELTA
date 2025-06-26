const db = require("../db");
const bcrypt = require('bcrypt');
//I KNOW SOME MODELS ARE NOT USED WE WILL COMMENT THEM GUYS 

exports.getReservationById = async (reservationId) => {
  const [rows] = await db.query(
    "SELECT * FROM Reservation WHERE ReservationID = ?", [reservationId]
  );
  return rows;
};

exports.getUserById = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM User WHERE UserID = ?", [userId]
  );
  return rows;
};

exports.getAvailableApprovedChauffeursByLocation = async (location) => {
  const [rows] = await db.query(
    "SELECT * FROM Chauffeur WHERE Availability = 'Available' AND Location = ? AND Status = 'Approved'",
    [location]
  );
  return rows;
};

exports.assignChauffeurToReservation = async (chauffeurId, reservationId) => {
  const [result] = await db.query(
    "UPDATE Reservation SET ChauffeurID = ?, LicenseID = NULL WHERE ReservationID = ?",
    [chauffeurId, reservationId]
  );
  return result;
};

exports.setChauffeurAvailability = async (chauffeurId, availability) => {
  const [result] = await db.query(
    "UPDATE Chauffeur SET Availability = ? WHERE ChauffeurID = ?",
    [availability, chauffeurId]
  );
  return result;
};

exports.attachVehicleToReservation = async (reservationId, vehicleId) => {
  const [result] = await db.query(
    "UPDATE Reservation SET VehicleID = ? WHERE ReservationID = ?",
    [vehicleId, reservationId]
  );
  return result;
};

exports.getPendingChauffeurs = async () => {
  const query = `
    SELECT ChauffeurID, Name, PhoneNumber, Status
    FROM Chauffeur
    WHERE Status = 'Pending'
  `;
  const [rows] = await db.query(query);
  return rows;
};


exports.updateChauffeurStatus = async (id, status) => {
  const chauffeur = await db.query("SELECT Status FROM Chauffeur WHERE ChauffeurID = ?", [id]);

  if (!chauffeur || chauffeur.length === 0) {
    throw new Error('Chauffeur not found');
  }

  // Prevent redundant status change
  if (chauffeur[0].Status === status) {
    throw new Error(`Chauffeur is already ${status}`);
  }

  const [result] = await db.query("UPDATE Chauffeur SET Status = ? WHERE ChauffeurID = ?", [status, id]);
  return result;
};


exports.respondToAssignment = async (response, reservationId) => {
  const query = `
    UPDATE Reservation
    SET ResponseStatus = ?
    WHERE ReservationID = ?
  `;
  const [result] = await db.query(query, [response, reservationId]);
  return result;
};

exports.releaseChauffeurByReservation = async (reservationId) => {
  const releaseQuery = `
    UPDATE Chauffeur
    SET Availability = 'Available'
    WHERE ChauffeurID = (
      SELECT ChauffeurID FROM Reservation WHERE ReservationID = ?
    )
  `;
  const [result] = await db.query(releaseQuery, [reservationId]);
  return result;
};

exports.getPendingAssignmentsByChauffeur = async (chauffeurId) => {
  const query = `
    SELECT 
      r.*,
      u.Name AS RenterName,
      u.PhoneNumber,
      TIMESTAMPDIFF(HOUR, r.StartDate, r.EndDate) AS DurationHours,
      r.ResponseStatus
    FROM Reservation r
    JOIN User u ON r.UserID = u.UserID
    WHERE r.ChauffeurID = ? AND r.ResponseStatus = 'Pending'
  `;
  const [rows] = await db.query(query, [chauffeurId]);
  return rows;
};



exports.updateReservationResponseStatus = async (reservationId, status) => {
  const [result] = await db.query(
    "UPDATE Reservation SET ResponseStatus = ? WHERE ReservationID = ?",
    [status, reservationId]
  );
  return result;
};

exports.registerChauffeur = async (chauffeurData) => {
  const { Name, PhoneNumber, Email, Password, LicenseNumber, Location, Date_of_birth } = chauffeurData;

  const hashedPassword = await bcrypt.hash(Password, 10);

  const query = `
    INSERT INTO Chauffeur (Name, PhoneNumber, Email, Password, LicenseNumber, Location, Date_of_birth, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  const [result] = await db.query(query, [Name, PhoneNumber, Email, hashedPassword, LicenseNumber, Location, Date_of_birth]);
  return result;  // Returns insertId for the new chauffeur
};

// Fetch a chauffeur by PhoneNumber (for login)
exports.getChauffeurByPhoneNumber = async (phoneNumber) => {
  const [rows] = await db.query("SELECT * FROM Chauffeur WHERE PhoneNumber = ?", [phoneNumber]);
  return rows[0];
};

// Get chauffeur by ID
exports.getChauffeurById = async (chauffeurId) => {
  const [rows] = await db.query("SELECT * FROM Chauffeur WHERE ChauffeurID = ?", [chauffeurId]);
  return rows[0]; // Return the first matching chauffeur (should be only one)
};

// Find chauffeur by phone number
exports.findByPhone = async (phone) => {
  const [rows] = await db.query('SELECT * FROM Chauffeur WHERE PhoneNumber = ?', [phone]);
  return rows[0];
};

// Update chauffeur profile fields
exports.updateChauffeurProfile = async (id, updates) => {
  const allowedFields = ["Name", "PhoneNumber", "Email", "Location", "Date_of_birth", "ProfilePictureUrl", "LicenseFileUrl"];
  // Convert Date_of_birth to YYYY-MM-DD if present
  if (updates.Date_of_birth) {
    const d = new Date(updates.Date_of_birth);
    if (!isNaN(d)) {
      updates.Date_of_birth = d.toISOString().split('T')[0];
    }
  }
  const setClause = Object.keys(updates)
    .filter((key) => allowedFields.includes(key))
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.keys(updates)
    .filter((key) => allowedFields.includes(key))
    .map((key) => updates[key]);
  if (!setClause) return { affectedRows: 0 };
  const [result] = await db.query(
    `UPDATE Chauffeur SET ${setClause} WHERE ChauffeurID = ?`,
    [...values, id]
  );
  return result;
};

// Update only the LicenseFileUrl for a chauffeur
exports.updateChauffeurLicenseFile = async (chauffeurId, fileUrl) => {
  const [result] = await db.query(
    "UPDATE Chauffeur SET LicenseFileUrl = ? WHERE ChauffeurID = ?",
    [fileUrl, chauffeurId]
  );
  return result;
};

// Get the license file URL for a chauffeur
exports.getChauffeurLicenseFileUrl = async (chauffeurId) => {
  const [rows] = await db.query(
    "SELECT LicenseFileUrl FROM Chauffeur WHERE ChauffeurID = ?",
    [chauffeurId]
  );
  return rows[0]?.LicenseFileUrl || null;
};

// Get all bookings (past and upcoming) for a chauffeur
exports.getBookingHistoryByChauffeur = async (chauffeurId) => {
  const query = `
    SELECT 
      r.*, 
      u.Name AS RenterName, 
      u.PhoneNumber AS RenterPhone, 
      v.Type AS VehicleType, 
      v.VehiclePic, 
      v.Location AS VehicleLocation,
      CASE 
        WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model)
        WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' - ', m.Type)
        WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' - ', b.BoatType)
        WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle - ', bi.Type)
        ELSE 'Unknown Vehicle'
      END as VehicleDetails
    FROM Reservation r
    JOIN User u ON r.UserID = u.UserID
    JOIN Vehicle v ON r.VehicleID = v.VehicleID
    LEFT JOIN Car c ON v.VehicleID = c.VehicleID AND v.Type = 'Car'
    LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID AND v.Type = 'Motorcycle'
    LEFT JOIN boats b ON v.VehicleID = b.VehicleID AND v.Type = 'boats'
    LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID AND v.Type = 'Bicycle'
    WHERE r.ChauffeurID = ?
    ORDER BY r.StartDate DESC
  `;
  const [rows] = await db.query(query, [chauffeurId]);
  return rows;
};

exports.updateChauffeurPassword = async (chauffeurId, hashedPassword) => {
  const [result] = await db.query(
    "UPDATE Chauffeur SET Password = ? WHERE ChauffeurID = ?",
    [hashedPassword, chauffeurId]
  );
  return [result];
};

// Fetch Chauffeur payout (ChauffeurAmount) for a given reservation or payment
exports.getChauffeurPayoutByReservation = async (reservationId) => {
  const [rows] = await db.query(
    'SELECT ChauffeurAmount FROM Payment WHERE ReservationID = ?',
    [reservationId]
  );
  return rows.length ? rows[0].ChauffeurAmount : null;
};

// Fetch all Chauffeur payouts for a given ChauffeurID
exports.getAllChauffeurPayouts = async (chauffeurId) => {
  const query = `
    SELECT p.PaymentID, p.ReservationID, p.ChauffeurAmount, p.TotalPrice, p.Status
    FROM Payment p
    JOIN Reservation r ON p.ReservationID = r.ReservationID
    WHERE r.ChauffeurID = ?
  `;
  const [rows] = await db.query(query, [chauffeurId]);
  return rows;
};
