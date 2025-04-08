const db = require('../db');

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ REGISTER USER
exports.registerUser = async (req, res) => {
    try {
        const { Name, PhoneNumber, Email, Password } = req.body;

        if (!Name || !PhoneNumber || !Email || !Password) {
            return res.status(400).json({ error: "All fields are required (Name, Phone, Email, Password)." });
        }

        // ✅ Check for existing user by email
        const existingUser = await new Promise((resolve, reject) => {
            User.findUserByEmail(Email, (err, user) => {
                if (err) reject(err);
                else resolve(user);
            });
        });

        if (existingUser) {
            return res.status(400).json({ message: "This email is already registered." });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // ✅ Insert into DB
        await new Promise((resolve, reject) => {
            User.createUser(Name, PhoneNumber, Email, hashedPassword, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(201).json({ message: "✅ User registered successfully!" });

    } catch (err) {
        console.error("❌ Register Error:", err.message || err);
        return res.status(500).json({ message: "Server error", error: err.message || err });
    }
};

// ✅ LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { PhoneNumber, Password } = req.body;

        if (!PhoneNumber || !Password) {
            return res.status(400).json({ error: "Phone number and password are required." });
        }

        const user = await new Promise((resolve, reject) => {
            User.findUserByPhone(PhoneNumber, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!user) return res.status(400).json({ error: "User not found." });

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

        const token = jwt.sign({ id: user.UserID, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            message: "✅ Login successful",
            token,
            user: {
                id: user.UserID,
                name: user.Name,
                phone: user.PhoneNumber,
                email: user.Email
            }
        });

    } catch (err) {
        console.error("❌ Login Error:", err.message || err);
        return res.status(500).json({ message: "Server error", error: err.message || err });
    }
};

// ✅ LOGIN ADMIN
exports.adminLogin = async (req, res) => {
    try {
        const { PhoneNumber, Password } = req.body; 

        if (!PhoneNumber || !Password) {
            return res.status(400).json({ error: "Phone number and password are required." });
        }

        const admin = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM Admin WHERE PhoneNumber = ?", [PhoneNumber], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });

        if (!admin) return res.status(404).json({ error: "Admin not found." });

        const isMatch = await bcrypt.compare(Password, admin.Password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

        const token = jwt.sign({ id: admin.AdminID, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });

        return res.status(200).json({
            message: "✅ Admin login successful",
            token,
            admin: {
                id: admin.AdminID,
                name: admin.Name,
                phone: admin.PhoneNumber,
                email: admin.Email
            }
        });

    } catch (err) {
        console.error("❌ Admin Login Error:", err.message || err);
        return res.status(500).json({ message: "Server error", error: err.message || err });
    }
};







// ✅ Get all vehicles
exports.getAllVehicles = (req, res) => {
    const isAdmin = req.user && req.user.role === 'admin';

    const query = isAdmin
        ? "SELECT * FROM Vehicle"
        : "SELECT * FROM Vehicle WHERE Status = 'Available'";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

exports.getAvailableVehicles = (req, res) => {
    db.query("SELECT * FROM Vehicle WHERE Status = 'Available'", (err, results) => {
        if (err) return res.status(500).json({ message: "DB Error", error: err });

        if (results.length === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json(results);
    });
};



// ✅ Get all cars
exports.getAllCars = (req, res) => {
    db.query("SELECT * FROM Vehicle v JOIN Car c ON v.VehicleID = c.VehicleID", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// ✅ Get all boats
exports.getAllBoats = (req, res) => {
    db.query("SELECT * FROM Vehicle v JOIN boats b ON v.VehicleID = b.VehicleID", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// ✅ Get all bicycles
exports.getAllBicycles = (req, res) => {
    db.query("SELECT * FROM Vehicle v JOIN Bicycle b ON v.VehicleID = b.VehicleID", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// ✅ Get all motorcycles
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

// ✅ Add vehicle
exports.addVehicle = (req, res) => {
    const { Type, Status, Location } = req.body;

    if (!Type || !Status || !Location) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "INSERT INTO Vehicle (Type, Status, Location) VALUES (?, ?, ?)";
    db.query(query, [Type, Status, Location], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error adding vehicle", error: err });
        }
        res.status(201).json({ message: "Vehicle added successfully", VehicleID: result.insertId });
    });
};


// ✅ Add Car
exports.addCar = (req, res) => {
    const { Brand, Model, Year, FuelType, Seats, Location } = req.body;
  
    // ✅ 1. Insert into Vehicle table first
    const vehicleQuery = "INSERT INTO Vehicle (Type, Status, Location) VALUES (?, 'Available', ?)";
    db.query(vehicleQuery, ['Car', Location], (err, vehicleResult) => {
      if (err) {
        return res.status(500).json({ message: "Error creating vehicle record", error: err });
      }
  
      const vehicleId = vehicleResult.insertId; // ✅ Get the generated VehicleID
  
      // ✅ 2. Insert into Car table using the new VehicleID
      const carQuery = "INSERT INTO Car (VehicleID, Brand, Model, Year, FuelType, Seats) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(carQuery, [vehicleId, Brand, Model, Year, FuelType, Seats], (err, carResult) => {
        if (err) {
          return res.status(500).json({ message: "Error creating car record", error: err });
        }
  
        res.status(201).json({ message: "✅ Car and vehicle added successfully", VehicleID: vehicleId });
      });
    });
  };
  
  
  // ✅ Add Boat
  exports.addBoat = (req, res) => {
    const { Length, Capacity, EngineType, Location } = req.body;

    if (!Length || !Capacity || !EngineType || !Location) {
        return res.status(400).json({ message: "All boat fields are required." });
    }

    db.query("INSERT INTO Vehicle (Type, Status, Location) VALUES (' boats ', 'Available', ?)",
        ['Boats', Location], (err, vehicleResult) => {
            if (err) return res.status(500).json({ message: "Error creating vehicle", error: err });

            const newVehicleID = vehicleResult.insertId;

            db.query("INSERT INTO Boats (VehicleID, Length, Capacity, EngineType) VALUES (?, ?, ?, ?)",
                [newVehicleID, Length, Capacity, EngineType], (err2) => {
                    if (err2) return res.status(500).json({ message: "Error creating boat", error: err2 });

                    res.status(201).json({
                        message: "✅ Boat added successfully",
                        VehicleID: newVehicleID
                    });
                });
        });
};

  
exports.addBicycle = (req, res) => {
    const { Type, Gears, Location } = req.body;

    if (!Type || !Gears || !Location) {
        return res.status(400).json({ message: "All bicycle fields are required." });
    }

    db.query("INSERT INTO Vehicle (Type, Status, Location) VALUES (?, 'Available', ?)",
        ['Bicycle', Location], (err, vehicleResult) => {
            if (err) return res.status(500).json({ message: "Error creating vehicle", error: err });

            const newVehicleID = vehicleResult.insertId;

            db.query("INSERT INTO Bicycle (VehicleID, Type, Gears) VALUES (?, ?, ?)",
                [newVehicleID, Type, Gears], (err2) => {
                    if (err2) return res.status(500).json({ message: "Error creating bicycle", error: err2 });

                    res.status(201).json({
                        message: "✅ Bicycle added successfully",
                        VehicleID: newVehicleID
                    });
                });
        });
};

exports.addMotorcycle = (req, res) => {
    const { Brand, EngineCC, Year, Type, Location } = req.body;

    if (!Brand || !EngineCC || !Year || !Type || !Location) {
        return res.status(400).json({ message: "All motorcycle fields are required." });
    }

    db.query("INSERT INTO Vehicle (Type, Status, Location) VALUES (?, 'Available', ?)",
        ['Motorcycle', Location], (err, vehicleResult) => {
            if (err) return res.status(500).json({ message: "Error creating vehicle", error: err });

            const newVehicleID = vehicleResult.insertId;

            db.query("INSERT INTO Motorcycle (VehicleID, Brand, EngineCC, Year, Type) VALUES (?, ?, ?, ?, ?)",
                [newVehicleID, Brand, EngineCC, Year, Type], (err2) => {
                    if (err2) return res.status(500).json({ message: "Error creating motorcycle", error: err2 });

                    res.status(201).json({
                        message: "✅ Motorcycle added successfully",
                        VehicleID: newVehicleID
                    });
                });
        });
};

  

  // src/controllers/vehicleController.js
exports.updateVehicle = (req, res) => {
    const { id } = req.params;
    const { Status, Location } = req.body;

    if (!Status || !Location) {
        return res.status(400).json({ message: "Status and Location are required." });
    }

    const query = "UPDATE Vehicle SET Status = ?, Location = ? WHERE VehicleID = ?";
    db.query(query, [Status, Location, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating vehicle", error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({ message: "Vehicle updated successfully" });
    });
};


// src/controllers/vehicleController.js
exports.deleteVehicle = (req, res) => {
    const { id } = req.params;
  
    db.query("DELETE FROM Vehicle WHERE VehicleID = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Error deleting vehicle", error: err });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
  
      res.status(200).json({ message: "Vehicle deleted successfully" });
    });
  };
  


