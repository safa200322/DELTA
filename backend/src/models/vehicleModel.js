const db = require('../db');

exports.insertVehicle = async (type, location, price, ownerId, vehiclepic = null) => {
  const query = `
    INSERT INTO Vehicle (Type, Status, Location, Price, vehiclepic, ownerID)
    VALUES (?, 'Available', ?, ?, ?, ?)
  `;
  return db.query(query, [type, location, price, vehiclepic, ownerId]);
};



exports.updateVehicleStatus = (vehicleID, status) => {
  const query = 'UPDATE Vehicle SET status = ? WHERE VehicleID = ?';
  return db.query(query, [status, vehicleID]);
};