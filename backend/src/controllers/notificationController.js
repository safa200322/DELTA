const NotificationModel = require('../models/Notification');

// Admin creates a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    const notification = await NotificationModel.create({ title, message, type, userId });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

// Public: Get all notifications (optionally filter by userId)
exports.getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const notifications = await NotificationModel.findAll({ userId });
    res.json(notifications);
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get notifications for the authenticated user
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await NotificationModel.findByUserId(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ message: 'Error fetching user notifications', error: error.message });
  }
};
