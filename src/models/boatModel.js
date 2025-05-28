const db = require("../db");

exports.insertBoat = (vehicleID, boatData) => {
  const query = `
    INSERT INTO boats (VehicleID, Capacity, EngineType, Brand, BoatType)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    vehicleID,
    boatData.Capacity,
    boatData.EngineType,
    boatData.Brand,
    boatData.BoatType
  ];
  return db.query(query, params);
};
