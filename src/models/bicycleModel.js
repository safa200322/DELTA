const db = require("../db");

exports.insertBicycle = (vehicleID, bicycleData) => {
  const query = `
    INSERT INTO Bicycle (VehicleID, Type, Gears)
    VALUES (?, ?, ?)
  `;
  const params = [
    vehicleID,
    bicycleData.Type,
    bicycleData.Gears
  ];
  return db.query(query, params);
};
