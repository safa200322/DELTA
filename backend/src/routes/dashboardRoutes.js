const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const adminAuth = require('../middleware/adminAuth'); // Protect this route

router.get('/dashboard', adminAuth, dashboardController.getAdminDashboard);
// Add inventory distribution endpoint for dashboard
router.get('/inventory-distribution', adminAuth, dashboardController.getVehicleInventoryDistribution);

module.exports = router;
