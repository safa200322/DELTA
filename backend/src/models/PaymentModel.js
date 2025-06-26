const db = require('../config/db');

// Commission rates per vehicle type
const COMMISSION_RATES = {
  Car: 0.15,
  boats: 0.20,
  Motorcycle: 0.12,
  Bicycle: 0.05
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
  const [reservation] = await db.query(
    'SELECT StartDate, EndDate FROM Reservation WHERE ReservationID = ?',
    [ReservationID]
  );
  if (!reservation.length) throw new Error('Reservation not found');
  const { StartDate, EndDate } = reservation[0];

  // 2. Get vehicle info
  const [vehicle] = await db.query(
    'SELECT Type, Price FROM Vehicle WHERE VehicleID = ?',
    [VehicleID]
  );
  if (!vehicle.length) throw new Error('Vehicle not found');
  const { Type, Price } = vehicle[0];

  // 3. Calculate number of days
  const start = new Date(StartDate);
  const end = new Date(EndDate);
  const timeDiff = Math.abs(end - start);
  const dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // includes both days

  // 4. Calculate totals
  const commissionRate = COMMISSION_RATES[Type];
  const totalPrice = dayCount * Price;
  const commissionAmount = totalPrice * commissionRate;
  const ownerEarning = totalPrice - commissionAmount;

  // 5. Insert into Payment table
  const [result] = await db.query(
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
      0 // placeholder for ChauffeurAmount, you’ll handle later
    ]
  );

  return {
    PaymentID: result.insertId,
    TotalPrice: totalPrice,
    CommissionAmount: commissionAmount,
    OwnerEarning: ownerEarning,
    DayCount: dayCount,
    VehicleType: Type
  };
};
