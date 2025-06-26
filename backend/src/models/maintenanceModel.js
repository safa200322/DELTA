const db = require('../db');

const MaintenanceModel = {
  async createMaintenance({ VehicleID, maintenance_info, PlannedDate, Status }) {
    const query = `
      INSERT INTO Maintenance (VehicleID, maintenance_info, PlannedDate, Status)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [VehicleID, maintenance_info, PlannedDate, Status]);
    return result;
  },

  async getMaintenanceByVehicleId(vehicleId) {
    const query = `
      SELECT 
        m.*,
        v.Type as VehicleType,
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model, ' (', c.Year, ')')
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle ', bi.Type)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(mo.Brand, ' ', mo.Type, ' (', mo.Year, ')')
          ELSE 'Unknown Vehicle'
        END AS VehicleName
      FROM Maintenance m
      JOIN Vehicle v ON m.VehicleID = v.VehicleID
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID
      LEFT JOIN Motorcycle mo ON v.VehicleID = mo.VehicleID
      WHERE m.VehicleID = ?
      ORDER BY m.PlannedDate DESC
    `;
    const [rows] = await db.query(query, [vehicleId]);
    return rows;
  },

  async getMaintenanceByOwnerId(ownerId) {
    const query = `
      SELECT 
        m.*,
        v.Type as VehicleType,
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model, ' (', c.Year, ')')
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle ', bi.Type)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(mo.Brand, ' ', mo.Type, ' (', mo.Year, ')')
          ELSE 'Unknown Vehicle'
        END AS VehicleName
      FROM Maintenance m
      JOIN Vehicle v ON m.VehicleID = v.VehicleID
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID
      LEFT JOIN Motorcycle mo ON v.VehicleID = mo.VehicleID
      WHERE v.ownerID = ?
      ORDER BY m.PlannedDate DESC
    `;
    const [rows] = await db.query(query, [ownerId]);
    return rows;
  },

  async getMaintenanceById(maintenanceId) {
    const query = 'SELECT * FROM Maintenance WHERE MaintenanceID = ?';
    const [rows] = await db.query(query, [maintenanceId]);
    return rows[0];
  },

  async updateMaintenance(maintenanceId, { maintenance_info, PlannedDate, Status }) {
    const query = `
      UPDATE Maintenance 
      SET maintenance_info = ?, PlannedDate = ?, Status = ?
      WHERE MaintenanceID = ?
    `;
    const [result] = await db.query(query, [maintenance_info, PlannedDate, Status, maintenanceId]);
    return result;
  },

  async deleteMaintenance(maintenanceId) {
    const query = 'DELETE FROM Maintenance WHERE MaintenanceID = ?';
    const [result] = await db.query(query, [maintenanceId]);
    return result;
  }
};

module.exports = MaintenanceModel;
