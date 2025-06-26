const db = require('../db');

const NotificationModel = {
  // Create a new notification
  async create({ title, message, type, userId }) {
    const query = `
      INSERT INTO Notification (UserID, Type, Content, Status) 
      VALUES (?, ?, ?, 'unread')
    `;
    const content = title ? `${title}: ${message}` : message;
    const [result] = await db.execute(query, [userId, type || 'General', content]);
    return {
      id: result.insertId,
      userId,
      type: type || 'General',
      content,
      status: 'unread'
    };
  },

  // Find all notifications with optional filtering
  async findAll(filters = {}) {
    let query = `
      SELECT 
        NotificationID as id,
        UserID as userId,
        Type as type,
        Content as message,
        Status as status,
        CURRENT_TIMESTAMP as createdAt
      FROM Notification
    `;
    const params = [];

    if (filters.userId) {
      query += ' WHERE UserID = ?';
      params.push(filters.userId);
    }

    query += ' ORDER BY NotificationID DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  },

  // Find notifications by user ID
  async findByUserId(userId, limit = null) {
    let query = `
      SELECT 
        NotificationID as id,
        UserID as userId,
        Type as type,
        Content as message,
        Status as status,
        CURRENT_TIMESTAMP as createdAt
      FROM Notification 
      WHERE UserID = ? 
      ORDER BY NotificationID DESC
    `;
    const params = [userId];

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  },

  // Update notification status
  async updateStatus(notificationId, status) {
    const query = 'UPDATE Notification SET Status = ? WHERE NotificationID = ?';
    const [result] = await db.execute(query, [status, notificationId]);
    return result.affectedRows > 0;
  },

  // Delete a notification
  async delete(notificationId) {
    const query = 'DELETE FROM Notification WHERE NotificationID = ?';
    const [result] = await db.execute(query, [notificationId]);
    return result.affectedRows > 0;
  }
};

module.exports = NotificationModel;
