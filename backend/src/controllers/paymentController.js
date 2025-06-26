const PaymentModel = require('../models/paymentModel');

// Commission rates
const COMMISSION_RATES = {
  car: 0.15,
  boat: 0.20,
  motorcycle: 0.12,
  bicycle: 0.05
};

// Chauffeur pricing logic (inline)
const CHAUFFEUR_DAILY_RATE = 40;
function calculateChauffeurAmount(startDate, endDate, hasChauffeur) {
  if (!hasChauffeur) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  return days * CHAUFFEUR_DAILY_RATE;
}

// Helper to calculate total price
function calculateTotalPrice({ vehiclePrice, startDate, endDate, accessoryPrice = 0, chauffeurAmount = 0 }) {
  const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  return (days * vehiclePrice) + accessoryPrice + chauffeurAmount;
}

exports.createPayment = async (req, res) => {
  try {
    const {
      ReservationID, Amount, Status, NameOnCard, CardNumber, ExpiryDate, CVV,
      PaymentMethod, vehicleType, vehiclePrice, startDate, endDate, accessoryPrice, ChauffeurID
    } = req.body;

    // Calculate chauffeur amount (only for cars with chauffeur)
    const chauffeurAmount = (vehicleType === 'car' && ChauffeurID) ? calculateChauffeurAmount(startDate, endDate, true) : 0;

    // Calculate total price
    const TotalPrice = calculateTotalPrice({ vehiclePrice, startDate, endDate, accessoryPrice, chauffeurAmount });
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
      PaidOut: 0,
      ChauffeurAmount: chauffeurAmount
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