const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const adminAuth = require('../middleware/adminAuth'); // Protect this route

router.get('/dashboard', adminAuth, dashboardController.getAdminDashboard);

module.exports = router;
