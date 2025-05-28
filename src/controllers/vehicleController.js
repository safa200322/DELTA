const vehicleModel = require('../models/vehicleModel');
const carModel = require('../models/carModel');
const boatModel = require('../models/boatModel');
const bicycleModel = require('../models/bicycleModel');
const motorcycleModel = require('../models/motorcycleModel');

exports.addCar = async (req, res) => {
  const { Brand, Model, Year, FuelType, Seats, Color, Transmission, Location } = req.body;

  if (!Brand || !Model || !Year || !FuelType || !Seats || !Location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [vehicleResult] = await vehicleModel.insertVehicle('Car', Location);
    const vehicleId = vehicleResult.insertId;

    await carModel.insertCar(vehicleId, { Brand, Model, Year, FuelType, Seats, Color, Transmission });

    res.status(201).json({ message: "Car and vehicle added successfully", VehicleID: vehicleId });
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};


exports.addBoat = async (req, res) => {
  const { Capacity, EngineType, Brand, BoatType, Location } = req.body;

  if (!Capacity || !EngineType || !Brand || !BoatType || !Location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [vehicleResult] = await vehicleModel.insertVehicle('boats', Location);
    const vehicleId = vehicleResult.insertId;

    await boatModel.insertBoat(vehicleId, { Capacity, EngineType, Brand, BoatType });

    res.status(201).json({ message: "Boat and vehicle added successfully", VehicleID: vehicleId });
  } catch (err) {
    console.error("Error adding boat:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.addBicycle = async (req, res) => {
  const { Type, Gears, Location } = req.body;

  if (!Type || !Gears || !Location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [vehicleResult] = await vehicleModel.insertVehicle('Bicycle', Location);
    const vehicleId = vehicleResult.insertId;

    await bicycleModel.insertBicycle(vehicleId, { Type, Gears });

    res.status(201).json({ message: "Bicycle and vehicle added successfully", VehicleID: vehicleId });
  } catch (err) {
    console.error("Error adding bicycle:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.addMotorcycle = async (req, res) => {
  const { Brand, Engine, Year, Type, Location, color } = req.body;

  if (!Brand || !Engine || !Year || !Type || !Location || !color) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [vehicleResult] = await vehicleModel.insertVehicle('Motorcycle', Location);
    const vehicleId = vehicleResult.insertId;

    await motorcycleModel.insertMotorcycle(vehicleId, { Brand, Engine, Year, Type, color });

    res.status(201).json({ message: " added sucessfully", VehicleID: vehicleId });
  } catch (err) {
    console.error("error adding:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.approveVehicle = async (req, res) => {
  try {
    const vehicleID = req.params.id;
    await vehicleModel.updateVehicleStatus(vehicleID, 'approved');
    res.status(200).json({ message: 'Vehicle approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectVehicle = async (req, res) => {
  try {
    const vehicleID = req.params.id;
    await vehicleModel.updateVehicleStatus(vehicleID, 'rejected');
    res.status(200).json({ message: 'Vehicle rejected successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
