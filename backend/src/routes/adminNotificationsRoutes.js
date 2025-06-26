const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const adminAuth = require('../middleware/adminAuth');

// Get all notifications (admin)
router.get('/', adminAuth, notificationController.getAllNotifications);
// Delete notification
router.delete('/:id', adminAuth, notificationController.deleteNotification);

module.exports = router;
