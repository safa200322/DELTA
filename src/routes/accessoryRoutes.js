const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessoryController');
const verifyToken = require('../middleware/verifyToken'); // Assuming you already have this

// Public
router.get('/', accessoryController.getAllAccessories);

// Admin Only
router.post('/', verifyToken, accessoryController.createAccessory);
router.put('/:id', verifyToken, accessoryController.updateAccessory);
router.delete('/:id', verifyToken, accessoryController.deleteAccessory);

module.exports = router;
