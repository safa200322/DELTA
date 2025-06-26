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
