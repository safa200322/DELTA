const db = require('../db');
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
  // 1. Fetch Reservation info
  const [reservationResult] = await db.query(
    'SELECT StartDate, EndDate, AccessoryID, ChauffeurID FROM Reservation WHERE ReservationID = ?',
    [ReservationID]
  );
  if (!reservationResult.length) throw new Error('Reservation not found');
  const { StartDate, EndDate, AccessoryID: accessoryFromDB, ChauffeurID: chauffeurFromDB } = reservationResult[0];

  // 2. Fetch Vehicle info
  const [vehicleResult] = await db.query(
    'SELECT Type, Price FROM Vehicle WHERE VehicleID = ?',
    [VehicleID]
  );
  if (!vehicleResult.length) throw new Error('Vehicle not found');
  const { Type, Price: VehiclePrice } = vehicleResult[0];

  // 3. Calculate rental duration in days
  const start = new Date(StartDate);
  const end = new Date(EndDate);
  const timeDiff = Math.abs(end - start);
  const dayCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // 4. Fetch Accessory price (if applicable)
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

  // 5. Calculate Chauffeur cost (if applicable)
  let chauffeurAmount = 0;
  if (chauffeurFromDB) {
    chauffeurAmount = 40 * dayCount;
  }

  // 6. Calculate totals
  const baseRental = VehiclePrice * dayCount;
  const commissionRate = COMMISSION_RATES[Type];
  const commissionAmount = baseRental * commissionRate;
  const totalPrice = baseRental + accessoryPrice + chauffeurAmount;
  const ownerEarning = baseRental - commissionAmount;

  // 7. Insert into Payment with status 'Pending'
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

  // 8. Immediately mark payment as 'Paid'
  await db.query(
    `UPDATE Payment SET Status = 'Paid' WHERE PaymentID = ?`,
    [paymentId]
  );


  return {
    PaymentID: paymentId,
    TotalPrice: totalPrice,
    AccessoryPrice: accessoryPrice,
    ChauffeurAmount: chauffeurAmount,
    CommissionAmount: commissionAmount,
    OwnerEarning: ownerEarning,
    DayCount: dayCount,
    VehicleType: Type
  };
};
