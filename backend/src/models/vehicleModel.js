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

exports.deleteVehicle = (vehicleID) => {
  const query = 'DELETE FROM Vehicle WHERE VehicleID = ?';
  return db.query(query, [vehicleID]);
};

exports.getVehiclesByOwner = async (ownerId) => {
  const query = `
    SELECT 
      v.VehicleID,
      v.Type,
      v.Status,
      v.Location,
      v.Price,
      v.vehiclepic,
      v.ownerID,
      CASE 
        WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model, ' (', c.Year, ')')
        WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' ', b.BoatType)
        WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle ', bi.Type)
        WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' ', m.Type, ' (', m.Year, ')')
        ELSE 'Unknown Vehicle'
      END AS VehicleName,
      CASE 
        WHEN v.Type = 'Car' THEN c.Color
        ELSE NULL
      END AS Color
    FROM Vehicle v
    LEFT JOIN Car c ON v.VehicleID = c.VehicleID
    LEFT JOIN boats b ON v.VehicleID = b.VehicleID
    LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID
    LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID
    WHERE v.ownerID = ?
    ORDER BY v.VehicleID DESC
  `;
  const [rows] = await db.query(query, [ownerId]);
  return rows;
};

exports.getVehicleById = async (vehicleID) => {
  const query = `
    SELECT 
      v.VehicleID,
      v.Type,
      v.Status,
      v.Location,
      v.Price,
      v.vehiclepic,
      v.ownerID,
      CASE 
        WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model, ' (', c.Year, ')')
        WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' ', b.BoatType)
        WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle ', bi.Type)
        WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' ', m.Type, ' (', m.Year, ')')
        ELSE 'Unknown Vehicle'
      END AS VehicleName,
      CASE 
        WHEN v.Type = 'Car' THEN c.Color
        ELSE NULL
      END AS Color
    FROM Vehicle v
    LEFT JOIN Car c ON v.VehicleID = c.VehicleID
    LEFT JOIN boats b ON v.VehicleID = b.VehicleID
    LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID
    LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID
    WHERE v.VehicleID = ?
  `;
  const [rows] = await db.query(query, [vehicleID]);
  return rows[0];
};