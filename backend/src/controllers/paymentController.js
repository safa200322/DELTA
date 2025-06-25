const PaymentModel = require('../models/paymentModel');

// Commission rates
const COMMISSION_RATES = {
  car: 0.15,
  boat: 0.20,
  motorcycle: 0.12,
  bicycle: 0.05
};

// Helper to calculate total price
function calculateTotalPrice({ vehiclePrice, startDate, endDate, accessoryPrice = 0, chauffeurPrice = 0 }) {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
  return (days * vehiclePrice) + accessoryPrice + chauffeurPrice;
}

exports.createPayment = async (req, res) => {
  try {
    const {
      ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV,
      PaymentMethod, vehicleType, vehiclePrice, startDate, endDate, accessoryPrice, chauffeurPrice
    } = req.body;

    // Calculate total price
    const TotalPrice = calculateTotalPrice({ vehiclePrice, startDate, endDate, accessoryPrice, chauffeurPrice });
    const CommissionRate = COMMISSION_RATES[vehicleType] || 0;
    const CommissionAmount = TotalPrice * CommissionRate;
    const OwnerEarning = TotalPrice - CommissionAmount;

    const paymentData = {
      ReservationID,
      Amount: Amount || TotalPrice,
      Status,
      NameOnCard,
      CardNumber,
      ExpiryDate,
      CVV,
      PaymentMethod,
      TotalPrice,
      CommissionRate,
      CommissionAmount,
      OwnerEarning,
      PaidOut: 0
    };

    await PaymentModel.createPayment(paymentData);
    res.status(201).json({ message: "Payment created successfully", payment: paymentData });
  } catch (err) {
    res.status(500).json({ message: "Error creating payment", error: err.message });
  }
};

exports.markOwnerPaid = async (req, res) => {
  try {
    const { paymentId } = req.params;
    await PaymentModel.markOwnerPaid(paymentId);
    res.json({ message: "Owner marked as paid." });
  } catch (err) {
    res.status(500).json({ message: "Error updating payment", error: err.message });
  }
};