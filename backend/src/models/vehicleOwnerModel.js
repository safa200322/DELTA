const db = require('../db');

const VehicleOwnerModel = {
  async createOwner({ FullName, Email, PasswordHash, PhoneNumber, NationalID }) {
    const query = `
      INSERT INTO vehicleowner (FullName, Email, PasswordHash, PhoneNumber, NationalID)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      FullName,
      Email,
      PasswordHash,
      PhoneNumber,
      NationalID
    ]);
    return result;
  },

  async getOwnerByEmail(email) {
    const query = 'SELECT * FROM vehicleowner WHERE Email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0];
  },

  async getOwnerById(id) {
    const query = 'SELECT * FROM vehicleowner WHERE OwnerID = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  async getOwnerByPhone(phone) {
    const query = 'SELECT * FROM vehicleowner WHERE PhoneNumber = ?';
    const [rows] = await db.query(query, [phone]);
    return rows[0];
  },

  async updateOwner(id, { FullName, Email, PhoneNumber, NationalID }) {
    const query = `
      UPDATE vehicleowner 
      SET FullName = ?, Email = ?, PhoneNumber = ?, NationalID = ?
      WHERE OwnerID = ?
    `;
    const [result] = await db.query(query, [FullName, Email, PhoneNumber, NationalID, id]);
    return result;
  },

  async updateProfilePicture(id, profileImageUrl) {
    const query = 'UPDATE vehicleowner SET ProfileImage = ? WHERE OwnerID = ?';
    const [result] = await db.query(query, [profileImageUrl, id]);
    return result;
  },

  async getVehiclesByOwner(ownerId) {
    const query = `
      SELECT 
        v.VehicleID,
        v.Type,
        v.Status,
        v.Location,
        v.Price,
        v.vehiclepic,
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model, ' (', c.Year, ')')
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle ', bi.Type)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' ', m.Type, ' (', m.Year, ')')
          ELSE 'Unknown Vehicle'
        END AS VehicleName,
        CASE 
          WHEN v.Type = 'Car' THEN c.Color
          WHEN v.Type = 'Motorcycle' THEN m.color
          ELSE NULL
        END AS Color
      FROM Vehicle v
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID  
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID
      LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID
      WHERE v.ownerID = ?
      ORDER BY v.VehicleID DESC
    `;
    const [rows] = await db.query(query, [ownerId]);
    return rows;
  },

  async getEarningsByOwner(ownerId) {
    // 1. Find all vehicles owned by this owner
    // 2. Find all reservations for those vehicles
    // 3. Find all payments for those reservations
    // 4. Sum the OwnerEarning field for all completed payments
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN p.Status = 'Paid' THEN p.OwnerEarning ELSE 0 END), 0) as TotalEarnings,
        COALESCE(SUM(CASE 
          WHEN MONTH(r.StartDate) = MONTH(CURRENT_DATE())
          AND YEAR(r.StartDate) = YEAR(CURRENT_DATE())
          AND p.Status = 'Paid'
          THEN p.OwnerEarning 
          ELSE 0 
        END), 0) as MonthlyEarnings,
        COUNT(CASE WHEN p.Status = 'Paid' THEN r.ReservationID END) as TotalRentals,
        COALESCE(AVG(CASE WHEN p.Status = 'Paid' THEN p.OwnerEarning END), 0) as AverageRental
      FROM Vehicle v
      LEFT JOIN Reservation r ON v.VehicleID = r.VehicleID
      LEFT JOIN Payment p ON r.ReservationID = p.ReservationID
      WHERE v.ownerID = ?
    `;
    const [rows] = await db.query(query, [ownerId]);
    return rows[0] || { TotalEarnings: 0, MonthlyEarnings: 0, TotalRentals: 0, AverageRental: 0 };
  },

  async getRecentPayouts(ownerId, limit = 5) {
    const query = `
      SELECT 
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model, ' Rental')
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' ', b.BoatType, ' Rental')
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle ', bi.Type, ' Rental')
          WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' ', m.Type, ' Rental')
          ELSE 'Vehicle Rental'
        END AS title,
        DATE_FORMAT(r.EndDate, '%b %d, %Y') as date,
        p.OwnerEarning as amount
      FROM Payment p
      JOIN Reservation r ON p.ReservationID = r.ReservationID
      JOIN Vehicle v ON r.VehicleID = v.VehicleID
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID
      LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID
      WHERE v.ownerID = ? AND p.Status = 'Paid'
      ORDER BY r.EndDate DESC
      LIMIT ?
    `;
    const [rows] = await db.query(query, [ownerId, limit]);
    return rows;
  }
};

module.exports = VehicleOwnerModel;
