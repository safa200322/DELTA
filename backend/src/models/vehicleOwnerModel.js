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
  }
};

module.exports = VehicleOwnerModel;
