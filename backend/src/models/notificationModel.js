const db = require('../db'); // your MySQL pool

exports.createNotification = async ({
  recipientID = null,
  title,
  message,
  type,
  broadcastGroup = null
}) => {
  const sql = `
    INSERT INTO Notification 
    (RecipientID, Title, Message, Type, BroadcastGroup)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [recipientID, title, message, type, broadcastGroup];

  try {
    const [result] = await db.execute(sql, values);
    return result.insertId;
  } catch (error) {
    console.error("Model error (createNotification):", error);
    throw error;
  }
};

// Get all notifications
exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM Notification ORDER BY NotificationID DESC');
  return rows;
};
