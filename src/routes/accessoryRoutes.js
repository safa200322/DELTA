const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessoryController');

// Create a new accessory
router.post('/', accessoryController.createAccessory);

// Get accessories by vehicle ID (uses vehicle type internally)
router.get('/:vehicleId', accessoryController.getAccessoriesForVehicle);

// Delete an accessory by ID
router.delete('/:accessoryId', accessoryController.deleteAccessory);

module.exports = router;
