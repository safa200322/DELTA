const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // e.g., 'Reservation', 'Payment', etc.
    allowNull: false,
    defaultValue: 'General',
  },
  userId: {
    type: DataTypes.INTEGER, // Optional: Personal notification
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Notification;
