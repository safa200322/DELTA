const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const adminAuth = require("../middleware/adminAuth");  // ← Import the admin JWT middleware
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", adminAuth, vehicleController.addVehicle);


// Public GET routes (no auth required to view vehicles):
router.get("/", authenticateToken, vehicleController.getAllVehicles);
router.get("/cars", vehicleController.getAllCars);
router.get("/boats", vehicleController.getAllBoats);
router.get("/bicycles", vehicleController.getAllBicycles);
router.get("/motorcycles", vehicleController.getAllMotorcycles);
router.get("/available", vehicleController.getAvailableVehicles);
router.get("/:id", vehicleController.getVehicleById);
// **Admin-only POST routes to add vehicles:** 
router.post("/cars", adminAuth, vehicleController.addCar);
router.post("/boats", adminAuth, vehicleController.addBoat);
router.post("/bicycles", adminAuth, vehicleController.addBicycle);
router.post("/motorcycles", adminAuth, vehicleController.addMotorcycle);

// **Admin-only PUT/DELETE routes to modify vehicles:** 
router.put("/:id", adminAuth, vehicleController.updateVehicle);
router.delete("/:id", adminAuth, vehicleController.deleteVehicle);



// (Optional) Test route to verify API is working
router.get("/test", (req, res) => {
  res.send("🚀 API is working!");
});




module.exports = router;
