const db = require("../db");

exports.insertMotorcycle = (vehicleID, motorcycleData) => {
  const query = `
    INSERT INTO Motorcycle (VehicleID, Brand, Engine, Year, Type)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    vehicleID,
    motorcycleData.Brand,
    motorcycleData.Engine,
    motorcycleData.Year,
    motorcycleData.Type
  ];
  return db.query(query, params);  
};
