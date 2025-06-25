const db = require('../db');

// ✅ Create a new accessory
exports.createAccessory = (req, res) => {
  const { Type, Quantity, Price } = req.body;

  if (!Type || !Quantity || !Price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = 'INSERT INTO Accessory (Type, Quantity, Price) VALUES (?, ?, ?)';
  db.query(query, [Type, Quantity, Price], (err, result) => {
    if (err) return res.status(500).json({ message: "Error adding accessory", error: err });
    res.status(201).json({ message: "Accessory created", accessoryId: result.insertId });
  });
};

// ✅ Get accessories for a vehicle (based on vehicle type)
exports.getAccessoriesForVehicle = (req, res) => {
  const vehicleId = req.params.vehicleId;

  const getTypeQuery = 'SELECT Type FROM Vehicle WHERE VehicleID = ?';
  db.query(getTypeQuery, [vehicleId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching vehicle type", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Vehicle not found" });

    const vehicleType = result[0].Type;

    const accessoryQuery = 'SELECT * FROM Accessory WHERE Type = ?';
    db.query(accessoryQuery, [vehicleType], (err, accessories) => {
      if (err) return res.status(500).json({ message: "Error fetching accessories", error: err });
      res.status(200).json(accessories);
    });
  });
};

// ✅ Delete accessory
exports.deleteAccessory = (req, res) => {
  const accessoryId = req.params.accessoryId;

  const query = 'DELETE FROM Accessory WHERE AccessoryID = ?';
  db.query(query, [accessoryId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting accessory", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.status(200).json({ message: "Accessory deleted successfully" });
  });
};
