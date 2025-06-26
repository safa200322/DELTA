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
