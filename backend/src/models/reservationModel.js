// src/models/reservationModel.js
const db = require('../db');

const ReservationModel = {
  async createReservation(data) {
    const {
      UserID,
      VehicleID,
      ChauffeurID,
      StartDate,
      EndDate,
      PickupLocation,
      DropoffLocation,
      AccessoryID
    } = data;

    const query = `
      INSERT INTO Reservation (
        UserID, VehicleID, LicenseID, ChauffeurID,
        StartDate, EndDate, PickupLocation, DropoffLocation, AccessoryID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      UserID,
      VehicleID,
      ChauffeurID || null,
      StartDate,
      EndDate,
      PickupLocation,
      DropoffLocation,
      AccessoryID || null
    ];

    const [result] = await db.query(query, values);
    return result;
  },

  async getAllReservations() {
    const [rows] = await db.query('SELECT * FROM Reservation');
    return rows;
  },

  async getReservationById(ReservationID) {
    const [rows] = await db.query('SELECT * FROM Reservation WHERE ReservationID = ?', [ReservationID]);
    return rows[0];
  },

  async deleteReservation(ReservationID) {
    const [result] = await db.query('DELETE FROM Reservation WHERE ReservationID = ?', [ReservationID]);
    return result;
  },

  async getReservationsByUserId(UserID) {
    const [rows] = await db.query('SELECT * FROM Reservation WHERE UserID = ?', [UserID]);
    return rows;
  },

  async cancelReservationByUser(ReservationID, UserID) {
  const [result] = await db.query(
    'DELETE FROM Reservation WHERE ReservationID = ? AND UserID = ?',
    [ReservationID, UserID]
  );
  return result;
}

};

module.exports = ReservationModel;
