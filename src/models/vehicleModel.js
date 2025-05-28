const db = require('../db');

exports.insertVehicle = (type, location) => {
  const sql = "INSERT INTO Vehicle (Type, Status, Location) VALUES (?, 'pending', ?)";
  return db.execute(sql, [type, location]);  // no need to call .promise()
};

exports.updateVehicleStatus = (vehicleID, status) => {
  const query = 'UPDATE Vehicle SET status = ? WHERE VehicleID = ?';
  return db.query(query, [status, vehicleID]);
};
