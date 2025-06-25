const db = require('../db');

exports.insertVehicle = async (Type, location, price, vehiclepic) => {
  const sql = `INSERT INTO Vehicle (Type, Location, Price, vehiclepic) VALUES (?, ?, ?, ? )`;
  return db.query(sql, [Type, location, price, vehiclepic]);
};


exports.updateVehicleStatus = (vehicleID, status) => {
  const query = 'UPDATE Vehicle SET status = ? WHERE VehicleID = ?';
  return db.query(query, [status, vehicleID]);
};