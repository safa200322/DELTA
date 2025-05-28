const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const adminAuth = require("../middleware/adminAuth"); 
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

//router.post("/", adminAuth, vehicleController.addVehicle);


//router.get("/", authenticateToken, vehicleController.getAllVehicles);
//router.get("/cars", vehicleController.getAllCars);
//router.get("/boats", vehicleController.getAllBoats);
//router.get("/bicycles", vehicleController.getAllBicycles);
//router.get("/motorcycles", vehicleController.getAllMotorcycles);
//router.get("/available", vehicleController.getAvailableVehicles);
//router.get("/:id", vehicleController.getVehicleById);

router.post("/cars", vehicleController.addCar);
router.post("/boats", vehicleController.addBoat);
router.post("/bicycles", vehicleController.addBicycle);
router.post("/motorcycles", vehicleController.addMotorcycle);


router.patch('/:id/approve', adminAuth, vehicleController.approveVehicle);
router.patch('/:id/reject', adminAuth,vehicleController.rejectVehicle);

//router.put("/:id", adminAuth, vehicleController.updateVehicle);
//router.delete("/:id", adminAuth, vehicleController.deleteVehicle);



router.get("/test", (req, res) => {
  res.send(" API is working!");
});


module.exports = router;
