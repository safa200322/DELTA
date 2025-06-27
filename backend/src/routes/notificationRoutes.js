const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/authMiddleware');

// POST /api/v1/notifications
router.post('/', notificationController.createNotification);

// GET /api/notifications/my (user's own notifications)
router.get('/my', authenticateToken, notificationController.getMyNotifications);

module.exports = router;
