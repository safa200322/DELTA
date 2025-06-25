const db = require("../db");

exports.insertMotorcycle = (vehicleID, motorcycleData) => {
  const query = `
    INSERT INTO Motorcycle (VehicleID, Brand, Engine, color, Year, Type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    vehicleID,
    motorcycleData.Brand,
    motorcycleData.Engine,
    motorcycleData.color, 
    motorcycleData.Year,
    motorcycleData.Type
  ];
  return db.query(query, params);  
};
