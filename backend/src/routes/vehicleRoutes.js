const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const adminAuth = require("../middleware/adminAuth"); 
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const authvehicleowner = require('../middleware/vehicleOwnerAuth');
//router.post("/", adminAuth, vehicleController.addVehicle);


//router.get("/", authenticateToken, vehicleController.getAllVehicles);
//router.get("/cars", vehicleController.getAllCars);
//router.get("/boats", vehicleController.getAllBoats);
//router.get("/bicycles", vehicleController.getAllBicycles);
//router.get("/motorcycles", vehicleController.getAllMotorcycles);
//router.get("/available", vehicleController.getAvailableVehicles);
//router.get("/:id", vehicleController.getVehicleById);

router.post("/cars", authvehicleowner,vehicleController.addCar);
router.post("/boats", authvehicleowner,vehicleController.addBoat);
router.post("/bicycles", authvehicleowner,vehicleController.addBicycle);
router.post("/motorcycles", authvehicleowner, vehicleController.addMotorcycle);


router.patch('/:id/approve', adminAuth, vehicleController.approveVehicle);
router.patch('/:id/reject', adminAuth,vehicleController.rejectVehicle);
router.patch("/deactivate/:id", authvehicleowner, vehicleController.deactivateVehicle);

//router.put("/:id", adminAuth, vehicleController.updateVehicle);
router.delete("/admindeletevehicle/:id", adminAuth, vehicleController.deleteVehicle);
router.delete("/vehicleownerdeletion/:id", authvehicleowner, vehicleController.deleteVehicle);




router.get("/test", (req, res) => {
  res.send(" API is working!");
});


module.exports = router;
