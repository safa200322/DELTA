const notificationModel = require('../models/notificationModel');

exports.createNotification = async (req, res) => {
  try {
    const {
      recipientID,
      title,
      message,
      type,
      broadcastGroup
    } = req.body;

    const notificationId = await notificationModel.createNotification({
      recipientID,
      title,
      message,
      type,
      broadcastGroup
    });

    res.status(201).json({ message: '✅ Notification created', notificationId });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notifications for the authenticated user
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await NotificationModel.findByUserId(userId);
    res.json(notifications);
    console.log('[NOTIFICATION] My notifications:', notifications);
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ message: 'Error fetching user notifications', error: error.message });
  }
};

// Delete notification (admin)
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const deleted = await NotificationModel.delete(notificationId);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
    console.log('[ADMIN][NOTIFICATION] Deleted:', notificationId);
  } catch (error) {
    console.error('[ADMIN][NOTIFICATION] Delete error:', error);
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};
