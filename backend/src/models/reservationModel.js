const db = require('../db');

// Commission rates by vehicle type
const COMMISSION_RATES = {
  Car: 0.15,
  boats: 0.20,
  Motorcycle: 0.12,
  Bicycle: 0.05
};

exports.createReservation = async ({
  StartDate,
  EndDate,
  VehicleID,
  AccessoryID,
  ChauffeurID,
  CustomerID
}) => {
  // 1. Validate dates
  if (new Date(StartDate) < new Date()) {
    throw new Error('Start date must be in the future');
  }
  if (new Date(EndDate) <= new Date(StartDate)) {
    throw new Error('End date must be after start date');
  }

  // 2. Check vehicle availability
  const [existingReservations] = await db.query(
    `SELECT r.ReservationID FROM Reservation r
     JOIN Vehicle v ON r.VehicleID = v.VehicleID
     WHERE v.VehicleID = ?
     AND r.Status = 'Reserved'
     AND (? < r.EndDate AND ? > r.StartDate)`,
    [VehicleID, StartDate, EndDate]
  );
  if (existingReservations.length) {
    throw new Error('Vehicle is not available for the selected dates');
  }

  // 3. Calculate rental duration
  const start = new Date(StartDate);
  const end = new Date(EndDate);
  const timeDiff = Math.abs(end - start);
  const dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // 4. Get vehicle info
  const [vehicleResult] = await db.query(
    'SELECT Type, Price FROM Vehicle WHERE VehicleID = ?',
    [VehicleID]
  );
  if (!vehicleResult.length) throw new Error('Vehicle not found');
  const { Type, Price: VehiclePrice } = vehicleResult[0];

  // 5. Calculate base rental price
  const baseRental = VehiclePrice * dayCount;

  // 6. Get accessory price if any
  let accessoryPrice = 0;
  if (AccessoryID) {
    const [accessoryResult] = await db.query(
      'SELECT Price FROM Accessory WHERE AccessoryID = ?',
      [AccessoryID]
    );
    if (accessoryResult.length) {
      accessoryPrice = accessoryResult[0].Price;
    }
  }

  // 7. Calculate chauffeur price
  let chauffeurAmount = 0;
  if (ChauffeurID) {
    chauffeurAmount = 40 * dayCount;
  }

  // 8. Calculate totals (exclude fuelCost)
  const totalPrice = baseRental + accessoryPrice + chauffeurAmount;

  // 9. Insert reservation
  const [insertResult] = await db.query(
    `INSERT INTO Reservation 
     (StartDate, EndDate, VehicleID, AccessoryID, ChauffeurID, CustomerID, Status)
     VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
    [StartDate, EndDate, VehicleID, AccessoryID, ChauffeurID, CustomerID]
  );

  const reservationId = insertResult.insertId;

  // 10. Return reservation summary
  return {
    ReservationID: reservationId,
    TotalPrice: totalPrice,
    AccessoryPrice: accessoryPrice,
    ChauffeurAmount: chauffeurAmount,
    DayCount: dayCount,
    VehicleType: Type
  };
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
