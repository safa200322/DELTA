const accessoryModel = require('../models/accessoryModel');
const db = require('../db');

exports.createAccessory = async (req, res) => {
  try {
    const { AccessoryName, VehicleType, Quantity, Price } = req.body;
    if (!AccessoryName || !VehicleType || !Quantity || !Price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const result = await accessoryModel.createAccessory({ AccessoryName, VehicleType, Quantity, Price });
    res.status(201).json({ message: "Accessory created", accessoryId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error adding accessory", error: err });
  }
};

exports.getAccessoriesForVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const getTypeQuery = 'SELECT VehicleType FROM Vehicle WHERE VehicleID = ?';
    const [result] = await db.query(getTypeQuery, [vehicleId]);
    if (result.length === 0) return res.status(404).json({ message: "Vehicle not found" });
    const vehicleType = result[0].VehicleType;
    const accessoryQuery = 'SELECT * FROM Accessory WHERE VehicleType = ?';
    const [accessories] = await db.query(accessoryQuery, [vehicleType]);
    res.status(200).json(accessories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching accessories", error: err });
  }
};

exports.deleteAccessory = async (req, res) => {
  try {
    const accessoryId = req.params.accessoryId;
    const result = await accessoryModel.deleteAccessory(accessoryId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Accessory not found" });
    }
    res.status(200).json({ message: "Accessory deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting accessory", error: err });
  }
};
