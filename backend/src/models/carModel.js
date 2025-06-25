const db = require('../db');

exports.insertCar = async (vehicleId, carData) => {
  const sql = `INSERT INTO Car (VehicleID, Brand, Model, Year, FuelType, Seats, color, Transmission)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const { Brand, Model, Year, FuelType, Seats, Color, Transmission } = carData;
  return db.query(sql, [vehicleId, Brand, Model, Year, FuelType, Seats, Color, Transmission]);
};
