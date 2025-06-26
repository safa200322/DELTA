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
