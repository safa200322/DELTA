const db = require('../db');

// Commission rates by vehicle type
const COMMISSION_RATES = {
  Car: 0.15,
  boats: 0.20,
  Motorcycle: 0.12,
  Bicycle: 0.05
};

// Fuel prices by fuel type
const FUEL_PRICE = {
  Petrol: 50,
  Diesel: 60,
  Electric: 20,
  Hybrid: 50
};

exports.createPayment = async ({
  ReservationID,
  VehicleID,
  AccessoryID,
  ChauffeurID,
  NameOnCard,
  CardNumber,
  ExpiryDate,
  CVV,
  PaymentMethod
}) => {
  // 1. Get reservation info
  const [reservationResult] = await db.query(
    'SELECT StartDate, EndDate, AccessoryID, ChauffeurID FROM Reservation WHERE ReservationID = ?',
    [ReservationID]
  );
  if (!reservationResult.length) throw new Error('Reservation not found');
  const { StartDate, EndDate, AccessoryID: accessoryFromDB, ChauffeurID: chauffeurFromDB } = reservationResult[0];

  // 2. Get vehicle info including FuelType
  const [vehicleResult] = await db.query(
    'SELECT Type, Price, FuelType FROM Vehicle WHERE VehicleID = ?',
    [VehicleID]
  );
  if (!vehicleResult.length) throw new Error('Vehicle not found');
  const { Type, Price: VehiclePrice, FuelType } = vehicleResult[0];

  // 3. Calculate rental duration
  const start = new Date(StartDate);
  const end = new Date(EndDate);
  const timeDiff = Math.abs(end - start);
  const dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // 4. Get accessory price if any
  let accessoryPrice = 0;
  if (accessoryFromDB) {
    const [accessoryResult] = await db.query(
      'SELECT Price FROM Accessory WHERE AccessoryID = ?',
      [accessoryFromDB]
    );
    if (accessoryResult.length) {
      accessoryPrice = accessoryResult[0].Price;
    }
  }

  // 5. Calculate chauffeur price
  let chauffeurAmount = 0;
  if (chauffeurFromDB) {
    chauffeurAmount = 40 * dayCount;
  }

  // 6. Get fuel cost from FUEL_PRICE map
  const fuelCost = FUEL_PRICE[FuelType] || 0;

  // 7. Calculate totals
  const baseRental = VehiclePrice * dayCount;
  const commissionRate = COMMISSION_RATES[Type];
  const commissionAmount = baseRental * commissionRate;
  const totalPrice = baseRental + accessoryPrice + chauffeurAmount + fuelCost;
  const ownerEarning = baseRental - commissionAmount;

  // 8. Insert Payment with status 'Pending'
  const [insertResult] = await db.query(
    `INSERT INTO Payment 
    (ReservationID, Status, NameOnCard, CardNumber, ExpiryDate, CVV, PaymentMethod,
     TotalPrice, CommissionAmount, OwnerEarning, ChauffeurAmount)
     VALUES (?, 'Pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ReservationID,
      NameOnCard,
      CardNumber,
      ExpiryDate,
      CVV,
      PaymentMethod,
      totalPrice,
      commissionAmount,
      ownerEarning,
      chauffeurAmount
    ]
  );

  const paymentId = insertResult.insertId;

  // 9. Mark payment as 'Paid'
  await db.query(
    `UPDATE Payment SET Status = 'Paid' WHERE PaymentID = ?`,
    [paymentId]
  );

  // 10. Update reservation status to 'Reserved'
  await db.query(
    `UPDATE Reservation SET Status = 'Reserved' WHERE ReservationID = ?`,
    [ReservationID]
  );

  // 11. Return summary
  return {
    PaymentID: paymentId,
    TotalPrice: totalPrice,
    AccessoryPrice: accessoryPrice,
    ChauffeurAmount: chauffeurAmount,
    FuelType,
    FuelCost: fuelCost,
    CommissionAmount: commissionAmount,
    OwnerEarning: ownerEarning,
    DayCount: dayCount,
    VehicleType: Type
  };
};
