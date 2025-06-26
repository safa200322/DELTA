// src/models/notificationModel.js
const db = require('../db');

// Create a notification for a user
exports.createUserNotification = async ({
  UserID,
  Title,
  Message,
  Type,
  RelatedID = null
}) => {
  await db.query(
    `INSERT INTO Notification (RecipientType, RecipientID, Title, Message, Type, RelatedID)
     VALUES ('User', ?, ?, ?, ?, ?)`,
    [UserID, Title, Message, Type, RelatedID]
  );
};

// Get all notifications for a user (most recent first)
exports.getUserNotifications = async (UserID) => {
  const [rows] = await db.query(
    `SELECT * FROM Notification WHERE RecipientType = 'User' AND RecipientID = ? ORDER BY CreatedAt DESC`,
    [UserID]
  );
  return rows;
};

// Mark a notification as read
exports.markNotificationRead = async (NotificationID) => {
  await db.query(
    `UPDATE Notification SET IsRead = TRUE WHERE NotificationID = ?`,
    [NotificationID]
  );
};
