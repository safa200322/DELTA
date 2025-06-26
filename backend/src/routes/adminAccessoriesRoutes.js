const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessoryController');
const adminAuth = require('../middleware/adminAuth');

// Get all accessories (admin)
router.get('/', adminAuth, accessoryController.getAllAccessories);
// Add accessory
router.post('/', adminAuth, accessoryController.createAccessory);
// Delete accessory
router.delete('/:id', adminAuth, accessoryController.deleteAccessory);

module.exports = router;
