const db = require('../db');

const accessoryModel = {
  async createAccessory({ AccessoryName, VehicleType, Quantity, Price }) {
    const query = 'INSERT INTO Accessory (AccessoryName, VehicleType, Quantity, Price) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [AccessoryName, VehicleType, Quantity, Price]);
    return result;
  },

  async deleteAccessory(accessoryId) {
    const query = 'DELETE FROM Accessory WHERE AccessoryID = ?';
    const [result] = await db.query(query, [accessoryId]);
    return result;
  },

  async getAccessoryPrice(accessoryId) {
    const query = 'SELECT Price FROM Accessory WHERE AccessoryID = ?';
    const [rows] = await db.query(query, [accessoryId]);
    return rows.length > 0 ? rows[0].Price : null;
  }
};

module.exports = accessoryModel;
