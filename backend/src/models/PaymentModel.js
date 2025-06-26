const db = require('../db');

const PaymentModel = {
  async createPayment(paymentData) {
    const {
      ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV,
      PaymentMethod, TotalPrice, CommissionRate, CommissionAmount, OwnerEarning, PaidOut
    } = paymentData;

    const [result] = await db.execute(
      `INSERT INTO Payment 
        (ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV, PaymentMethod, 
         TotalPrice, CommissionRate, CommissionAmount, OwnerEarning, PaidOut)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV, PaymentMethod,
        TotalPrice, CommissionRate, CommissionAmount, OwnerEarning, PaidOut
      ]
    );
    return result;
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