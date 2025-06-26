const db = require('../db');

// Commission rates by vehicle type
const COMMISSION_RATES = {
  Car: 0.15,
  boats: 0.20,
  Motorcycle: 0.12,
  Bicycle: 0.05
};


exports.createReservation = async (reservationData) => {
  // Adjust field names as needed for your schema
  const {
    vehicleId,
    pickupDateTime,
    dropoffDateTime,
    pickupLocation,
    dropoffLocation,
    UserID // from controller
  } = reservationData;

  const [result] = await db.query(
    `INSERT INTO Reservation (VehicleID, UserID, StartDate, EndDate, PickupLocation, DropoffLocation)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [vehicleId, UserID, pickupDateTime, dropoffDateTime, pickupLocation, dropoffLocation]
  );

  // Create notification after reservation is inserted
  try {
    const notificationModel = require('./notificationModel');
    await notificationModel.createNotification({
      recipientID: UserID,
      title: 'Reservation Created',
      message: `Your reservation #${result.insertId} has been created successfully!`,
      type: 'Reservation',
      broadcastGroup: null
    });
  } catch (notifyErr) {
    console.error('Notification creation failed:', notifyErr);
  }

  return result;
};

exports.getReservationsByUserId = async (userId) => {
  // 1. Get all reservations with vehicle type and all Vehicle table fields
  const [reservations] = await db.query(
    `SELECT r.*, v.*, v.VehiclePic
     FROM Reservation r
     JOIN Vehicle v ON r.VehicleID = v.VehicleID
     WHERE r.UserID = ?
     ORDER BY r.StartDate DESC`,
    [userId]
  );

  // 2. For each reservation, fetch type-specific details
  const detailedReservations = await Promise.all(reservations.map(async (reservation) => {
    let typeTable = null;
    let typeDetails = {};
    switch ((reservation.Type || '').toLowerCase()) {
      case 'car':
        typeTable = 'car';
        break;
      case 'boat':
        typeTable = 'boat';
        break;
      case 'motorcycle':
        typeTable = 'motorcycle';
        break;
      case 'bicycle':
        typeTable = 'bicycle';
        break;
      default:
        typeTable = null;
    }
    if (typeTable) {
      const [rows] = await db.query(
        `SELECT * FROM ${typeTable} WHERE VehicleID = ?`,
        [reservation.VehicleID]
      );
      if (rows && rows[0]) {
        typeDetails = rows[0];
      }
    }
    // Merge: Vehicle fields + type-specific fields + reservation fields
    return { ...reservation, ...typeDetails };
  }));
  return detailedReservations;
};
