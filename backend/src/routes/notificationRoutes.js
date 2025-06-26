const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: View all notifications (optionally filter by userId)
router.get('/', notificationController.getAllNotifications);

// User-specific: Get notifications for the authenticated user
router.get('/my', authMiddleware, notificationController.getMyNotifications);

// Admin: Create a notification
router.post('/', authMiddleware, notificationController.createNotification);

module.exports = router;
