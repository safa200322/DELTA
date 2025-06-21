const db = require("../db");

exports.addChauffeur = async (chauffeurData) => {
  const { Name, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, Password } = chauffeurData;

  const query = `
    INSERT INTO Chauffeur 
    (Name, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, Password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.query(query, [Name, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, Password]);
  return result;
};

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
  const [rows] = await db.query("SELECT * FROM Chauffeur WHERE Status = 'Pending'");
  return rows;
};

exports.updateChauffeurStatus = async (id, status) => {
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
      TIMESTAMPDIFF(HOUR, r.StartDate, r.EndDate) AS DurationHours
    FROM Reservation r
    JOIN User u ON r.UserID = u.UserID
    WHERE r.ChauffeurID = ?
  `;
  const [rows] = await db.query(query, [chauffeurId]);
  return rows;
};