const db = require('../db');

const PaymentModel = {
  async createPayment(paymentData) {
    const {
      ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV,
      PaymentMethod, TotalPrice, CommissionRate, CommissionAmount, OwnerEarning, PaidOut, ChauffeurAmount
    } = paymentData;

    const [result] = await db.execute(
      `INSERT INTO Payment 
        (ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV, PaymentMethod, 
         TotalPrice, CommissionRate, CommissionAmount, OwnerEarning, PaidOut, ChauffeurAmount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV, PaymentMethod,
        TotalPrice, CommissionRate, CommissionAmount, OwnerEarning, PaidOut, ChauffeurAmount
      ]
    );
    return result;
  },

  async getUserPayments(userID) {
    const query = `
      SELECT 
        p.*,
        r.StartDate,
        r.EndDate,
        r.PickupLocation,
        r.DropoffLocation,
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' - ', m.Type)
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' - ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle - ', bi.Type)
          ELSE 'Unknown Vehicle'
        END as VehicleDetails,
        v.Type as VehicleType,
        v.VehiclePic,
        vo.FullName as OwnerName,
        vo.PhoneNumber as OwnerPhone,
        ch.Name as ChauffeurName
      FROM Payment p
      JOIN Reservation r ON p.ReservationID = r.ReservationID
      JOIN Vehicle v ON r.VehicleID = v.VehicleID
      LEFT JOIN VehicleOwner vo ON v.OwnerID = vo.OwnerID
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID AND v.Type = 'Car'
      LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID AND v.Type = 'Motorcycle'
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID AND v.Type = 'boats'
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID AND v.Type = 'Bicycle'
      LEFT JOIN Chauffeur ch ON r.ChauffeurID = ch.ChauffeurID
      WHERE r.UserID = ?
      ORDER BY r.StartDate DESC
    `;
    const [rows] = await db.execute(query, [userID]);
    return rows;
  },

  async markOwnerPaid(paymentId) {
    const [result] = await db.execute(
      `UPDATE Payment SET PaidOut = 1 WHERE PaymentID = ?`,
      [paymentId]
    );
    return result;
  }
};

module.exports = PaymentModel;