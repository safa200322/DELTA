const Notification = require('../models/Notification');

// Admin creates a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    const notification = await Notification.create({ title, message, type, userId });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

// Public: Get all notifications (optionally filter by userId)
exports.getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    let notifications;

    if (userId) {
      notifications = await Notification.findAll({
        where: {
          userId,
        },
        order: [['createdAt', 'DESC']],
      });
    } else {
      notifications = await Notification.findAll({
        order: [['createdAt', 'DESC']],
      });
    }

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};
