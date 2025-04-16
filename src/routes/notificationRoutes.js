const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyToken = require('../middleware/verifyToken');

// Public: View all notifications (optionally filter by userId)
router.get('/', notificationController.getAllNotifications);

// Admin: Create a notification
router.post('/', verifyToken, notificationController.createNotification);

module.exports = router;
