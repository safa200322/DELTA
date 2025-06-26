const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const vehicleOwnerAuth = require('../middleware/vehicleOwnerAuth');

// Vehicle owner maintenance routes
router.get('/vehicle/:vehicleId', vehicleOwnerAuth, maintenanceController.getVehicleMaintenance);
router.post('/vehicle/:vehicleId', vehicleOwnerAuth, maintenanceController.addMaintenance);
router.get('/my-vehicles', vehicleOwnerAuth, maintenanceController.getOwnerVehiclesMaintenance);
router.put('/:maintenanceId', vehicleOwnerAuth, maintenanceController.updateMaintenance);
router.delete('/:maintenanceId', vehicleOwnerAuth, maintenanceController.deleteMaintenance);

module.exports = router;
