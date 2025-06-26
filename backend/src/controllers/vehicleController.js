const vehicleModel = require('../models/vehicleModel');
const carModel = require('../models/carModel');
const boatModel = require('../models/boatModel');
const bicycleModel = require('../models/bicycleModel');
const motorcycleModel = require('../models/motorcycleModel');
const CarPricingEngine = require('../models/CarPricingEngine');
const pricingEngine = new CarPricingEngine();
const BoatPricingEngine = require('../models/BoatPricingEngine');
const pricingboat = new BoatPricingEngine();
const MotorcyclePricingEngine = require('../models/MotorcyclePricingEngine');
const pricingmotorcycle = new MotorcyclePricingEngine();
const  BicyclePricingEngine = require('../models/BicyclePricingEngine');
const pricingBicycle = new BicyclePricingEngine();




exports.addCar = async (req, res) => {
  const { Brand, Model, Year, FuelType, Seats, Color, Transmission, Location, vehiclepic } = req.body;
  // Use id from JWT as ownerId
  const ownerId = req.user && (req.user.ownerID || req.user.id);
  console.log("Adding car with data:", ownerId);

  // Collect missing fields
  const missingFields = [];
  if (!Brand) missingFields.push('Brand');
  if (!Model) missingFields.push('Model');
  if (!Year) missingFields.push('Year');
  if (!FuelType) missingFields.push('FuelType');
  if (!Seats) missingFields.push('Seats');
  if (!Location) missingFields.push('Location');
  if (!ownerId) missingFields.push('ownerId');

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    const carData = { Brand, Model, Year, FuelType, Seats };
    const calculatedPrice = pricingEngine.calculatePrice(carData, Location);

    const [vehicleResult] = await vehicleModel.insertVehicle('Car', Location, calculatedPrice, ownerId, vehiclepic);
    const vehicleId = vehicleResult.insertId;

    await carModel.insertCar(vehicleId, { Brand, Model, Year, FuelType, Seats, Color, Transmission });

    res.status(201).json({
      message: "The car is added",
      VehicleID: vehicleId,
      calculatedPrice
    });

  } catch (err) {
    console.error("Can't add the car:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




exports.addBoat = async (req, res) => {
  const {
    Capacity,
    EngineType,
    Brand,
    BoatType,
    Location,
    vehiclepic
  } = req.body;

  const ownerId = req.user && (req.user.ownerID || req.user.id);

  if (
    Capacity == null ||
    !EngineType ||
    !Brand ||
    !BoatType ||
    !Location ||
    !ownerId
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    //  Calculate the daily price
    const price = pricingboat.calculatePrice({
      BoatType,
      Capacity: Number(Capacity),
      EngineType
    });

    // Insert vehicle record with price
    const [vehicleResult] = await vehicleModel.insertVehicle(
      'boats',
      Location,
      price,
      ownerId,
      vehiclepic
    );
    const vehicleId = vehicleResult.insertId;

    //  Insert boat-specific data
    await boatModel.insertBoat(vehicleId, {
      Capacity: Number(Capacity),
      EngineType,
      Brand,
      BoatType
    });

    //  Return success response including price
    res.status(201).json({
      message: "Boat and vehicle added successfully",
      VehicleID: vehicleId,
      calculatedPrice: price
    });
  } catch (err) {
    console.error("Error adding boat:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addBicycle = async (req, res) => {
  const { Type, Gears, Location, vehiclepic } = req.body;
  const ownerId = req.user && (req.user.ownerID || req.user.id);

  if (!Type || !Gears || !Location || !ownerId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const price =  pricingBicycle.calculatePrice({ Type, Gears }, Location);

    const [vehicleResult] = await vehicleModel.insertVehicle('Bicycle', Location, price, ownerId, vehiclepic);
    const vehicleId = vehicleResult.insertId;

    await bicycleModel.insertBicycle(vehicleId, { Type, Gears });

    res.status(201).json({
      message: "Bicycle and vehicle added successfully",
      VehicleID: vehicleId,
      calculatedPrice: price
    });
  } catch (err) {
    console.error("Error adding bicycle:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addMotorcycle = async (req, res) => {
  const { Brand, Engine, Year, Type, Location, color, vehiclepic } = req.body;
  const ownerId = req.user && (req.user.ownerID || req.user.id);

  if (!Brand || !Engine || !Year || !Type || !Location || !color || !ownerId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const price = pricingmotorcycle.calculatePrice({ Brand, Engine, Year, Type }, Location);

    const [vehicleResult] = await vehicleModel.insertVehicle('Motorcycle', Location, price, ownerId, vehiclepic);
    const vehicleId = vehicleResult.insertId;

    await motorcycleModel.insertMotorcycle(vehicleId, { Brand, Engine, Year, Type, color });

    res.status(201).json({
      message: "Motorcycle and vehicle added successfully",
      VehicleID: vehicleId,
      calculatedPrice: price
    });
  } catch (err) {
    console.error("Error adding motorcycle:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicleID = req.params.id;
    await vehicleModel.deleteVehicle(vehicleID);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};