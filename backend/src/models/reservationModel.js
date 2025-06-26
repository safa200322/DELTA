// src/models/reservationModel.js
const db = require('../db');

const ReservationModel = {
  async createReservation(data) {
    const {
      UserID,
      VehicleID,
      LicenseID,
      ChauffeurID,
      StartDate,
      EndDate,
      PickupLocation,
      DropoffLocation,
      AccessoryID
    } = data;

    const query = `
      INSERT INTO Reservation (
        UserID, VehicleID, ChauffeurID,
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
  },

  async getReservationsByVehicleOwner(ownerID) {
    const query = `
      SELECT 
        r.*,
        v.Brand,
        v.Model,
        v.Type,
        v.VehiclePic,
        u.FirstName,
        u.LastName,
        u.Email
      FROM Reservation r
      JOIN Vehicle v ON r.VehicleID = v.VehicleID
      JOIN User u ON r.UserID = u.UserID
      WHERE v.OwnerID = ?
      ORDER BY r.StartDate DESC
    `;
    const [rows] = await db.query(query, [ownerID]);
    return rows;
  }
};

module.exports = ReservationModel;
