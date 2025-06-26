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
    const query = `
      SELECT 
        r.*,
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' - ', m.Type)
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' - ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle - ', bi.Type)
          ELSE 'Unknown Vehicle'
        END as VehicleDetails,
        v.Type as VehicleType,
        v.VehiclePic,
        v.Location as VehicleLocation,
        vo.FullName as OwnerName,
        vo.PhoneNumber as OwnerPhone,
        ch.Name as ChauffeurName,
        ch.PhoneNumber as ChauffeurPhone
      FROM Reservation r
      JOIN Vehicle v ON r.VehicleID = v.VehicleID
      LEFT JOIN VehicleOwner vo ON v.OwnerID = vo.OwnerID
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID AND v.Type = 'Car'
      LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID AND v.Type = 'Motorcycle'
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID AND v.Type = 'boats'
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID AND v.Type = 'Bicycle'
      LEFT JOIN Chauffeur ch ON r.ChauffeurID = ch.ChauffeurID
      WHERE r.UserID = ?
      ORDER BY r.StartDate DESC
    `;
    const [rows] = await db.query(query, [UserID]);
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
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' - ', m.Type)
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' - ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle - ', bi.Type)
          ELSE 'Unknown Vehicle'
        END as VehicleDetails,
        v.Type as VehicleType,
        v.VehiclePic,
        u.Name as CustomerName,
        u.Email as CustomerEmail,
        u.PhoneNumber as CustomerPhone
      FROM Reservation r
      JOIN Vehicle v ON r.VehicleID = v.VehicleID
      JOIN User u ON r.UserID = u.UserID
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID AND v.Type = 'Car'
      LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID AND v.Type = 'Motorcycle'
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID AND v.Type = 'boats'
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID AND v.Type = 'Bicycle'
      WHERE v.OwnerID = ?
      ORDER BY r.StartDate DESC
    `;
    const [rows] = await db.query(query, [ownerID]);
    return rows;
  }
};

module.exports = ReservationModel;
