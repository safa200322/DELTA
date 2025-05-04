const db = require('../db');
const Notification = require('../models/Notification'); // for notifications

// ✅ Get all vehicles
exports.getAllVehicles = (req, res) => {
  const isAdmin = req.user && req.user.role === 'admin';
  const query = isAdmin ? "SELECT * FROM Vehicle" : "SELECT * FROM Vehicle WHERE Status = 'Available'";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.getAvailableVehicles = (req, res) => {
  db.query("SELECT * FROM Vehicle WHERE Status = 'Available'", (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(results);
  });
};

// ✅ Get by sub-type
exports.getAllCars = (req, res) => {
  db.query("SELECT * FROM Vehicle v JOIN Car c ON v.VehicleID = c.VehicleID", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.getAllBoats = (req, res) => {
  db.query("SELECT * FROM Vehicle v JOIN boats b ON v.VehicleID = b.VehicleID", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.getAllBicycles = (req, res) => {
  db.query("SELECT * FROM Vehicle v JOIN Bicycle b ON v.VehicleID = b.VehicleID", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

exports.getAllMotorcycles = (req, res) => {
  db.query("SELECT * FROM Vehicle v JOIN Motorcycle m ON v.VehicleID = m.VehicleID", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// ✅ Get vehicle by ID
exports.getVehicleById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Vehicle WHERE VehicleID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(result[0]);
  });
};

// ✅ Add generic vehicle
exports.addVehicle = async (req, res) => {
  const { Type, Status, Location } = req.body;
  if (!Type || !Status || !Location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query("INSERT INTO Vehicle (Type, Status, Location) VALUES (?, ?, ?)", [Type, Status, Location], async (err, result) => {
    if (err) return res.status(500).json({ message: "Error adding vehicle", error: err });

    await Notification.create({
      title: "Vehicle Added",
      message: `A new ${Type} was added.`,
      type: "Vehicle",
      userId: 1
    });

    res.status(201).json({ message: "Vehicle added successfully", VehicleID: result.insertId });
  });
};

// ✅ Add Car
exports.addCar = (req, res) => {
  const { Brand, Model, Year, FuelType, Seats, Location } = req.body;

  db.query("INSERT INTO Vehicle (Type, Status, Location) VALUES (?, 'Available', ?)", ['Car', Location], (err, vehicleResult) => {
    if (err) return res.status(500).json({ message: "Error creating vehicle record", error: err });

    const vehicleId = vehicleResult.insertId;
    db.query("INSERT INTO Car (VehicleID, Brand, Model, Year, FuelType, Seats) VALUES (?, ?, ?, ?, ?, ?)",
      [vehicleId, Brand, Model, Year, FuelType, Seats], async (err2) => {
        if (err2) return res.status(500).json({ message: "Error creating car record", error: err2 });

        await Notification.create({
          title: "Car Added",
          message: `A new car (${Brand} ${Model}) was added.`,
          type: "Vehicle",
          userId: 1
        });

        res.status(201).json({ message: "Car and vehicle added successfully", VehicleID: vehicleId });
      });
  });
};

// ✅ Add/update other subtypes (Boat, Bicycle, Motorcycle)
// Repeat the same notification pattern for addBoat, addBicycle, addMotorcycle

// ✅ Update vehicle
exports.updateVehicle = (req, res) => {
  const { id } = req.params;
  const { Status, Location } = req.body;

  if (!Status || !Location) {
    return res.status(400).json({ message: "Status and Location are required." });
  }

  const query = "UPDATE Vehicle SET Status = ?, Location = ? WHERE VehicleID = ?";
  db.query(query, [Status, Location, id], async (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating vehicle", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vehicle not found" });

    await Notification.create({
      title: "Vehicle Updated",
      message: `Vehicle #${id} status/location has been updated.`,
      type: "Vehicle",
      userId: 1
    });

    res.status(200).json({ message: "Vehicle updated successfully" });
  });
};

// ✅ Delete vehicle
exports.deleteVehicle = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Vehicle WHERE VehicleID = ?", [id], async (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting vehicle", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vehicle not found" });

    await Notification.create({
      title: "Vehicle Deleted",
      message: `Vehicle #${id} has been removed from the system.`,
      type: "Vehicle",
      userId: 1
    });

    res.status(200).json({ message: "Vehicle deleted successfully" });
  });
};
