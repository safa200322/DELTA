const paymentModel = require('../models/paymentModel');
const vehicleModel = require('../models/vehicleModel');
const accessoryModel = require('../models/accessoryModel');
const chauffeurModel = require('../models/chauffeurModel');

// Commission Rates based on vehicle type
const COMMISSION_RATES = {
  car: 0.15,
  boat: 0.20,
  motorcycle: 0.12,
  bicycle: 0.05
};

// Fuel prices based on fuel type
const FUEL_PRICE = {
  Petrol: 50,
  Diesel: 60,
  Electric: 20,
  Hybrid: 50
};

// Helper to calculate chauffeur amount
function calculateChauffeurAmount(startDate, endDate) {
  const dailyRate = 40; // $40 per day for chauffeur
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));  // Calculate days
  return days * dailyRate;
}

// Helper to calculate the total price
async function calculateTotalPrice({ vehicleId, chauffeurId, accessoryId, startDate, endDate }) {
  // Get vehicle details
  const vehicle = await vehicleModel.getVehicleById(vehicleId);
  const vehiclePrice = vehicle.Price;
  const vehicleType = vehicle.Type;
  const fuelType = vehicle.FuelType;

  // Get accessory price if any
  const accessoryPrice = accessoryId ? await accessoryModel.getAccessoryPrice(accessoryId) : 0;

  // Get chauffeur amount if assigned
  const chauffeurAmount = chauffeurId ? calculateChauffeurAmount(startDate, endDate) : 0;

  // Calculate commission rate based on vehicle type
  const commissionRate = COMMISSION_RATES[vehicleType] || 0;
  const commissionAmount = vehiclePrice * commissionRate;

  // Calculate fuel price based on fuel type
  const fuelPrice = FUEL_PRICE[fuelType] || 0;

  // Calculate total price (Days * vehicle price) + accessories + chauffeur + fuel price
  const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))); // Calculate days again
  const totalPrice = (days * vehiclePrice) + accessoryPrice + chauffeurAmount + fuelPrice;

  // Calculate owner earnings (vehicle price - commission amount - fuel price)
  const ownerEarnings = vehiclePrice - commissionAmount - fuelPrice;

  return {
    totalPrice,
    commissionAmount,
    ownerEarnings,
    chauffeurAmount
  };
}

exports.createPayment = async (req, res) => {
  try {
    const {
      ReservationID, NameOnCard, CardNumber, ExpiryDate, CVV, PaymentMethod, VehicleID, ChauffeurID, AccessoryID, StartDate, EndDate
    } = req.body;

    // Validate necessary fields
    if (!ReservationID || !NameOnCard || !CardNumber || !ExpiryDate || !CVV || !PaymentMethod || !VehicleID || !StartDate || !EndDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate total price, commission amount, and owner earnings
    const { totalPrice, commissionAmount, ownerEarnings, chauffeurAmount } = await calculateTotalPrice({
      vehicleId: VehicleID,
      chauffeurId: ChauffeurID,
      accessoryId: AccessoryID,
      startDate: StartDate,
      endDate: EndDate
    });

    // Payment data to insert
    const paymentData = {
      ReservationID,
      Amount: totalPrice,
      Status: "Paid",
      NameOnCard,
      CardNumber,
      ExpiryDate,
      CVV,
      PaymentMethod,
      TotalPrice: totalPrice,
      CommissionRate: COMMISSION_RATES.car, // You can replace with dynamic based on vehicle type
      CommissionAmount: commissionAmount,
      OwnerEarning: ownerEarnings,
      PaidOut: false, // initially set to false until owner is paid
      ChauffeurAmount: chauffeurAmount
    };

    // Insert payment record in the database
    await paymentModel.createPayment(paymentData);

    // Send success response
    res.status(201).json({
      message: "Payment created successfully",
      payment: paymentData
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Error creating payment", error: err.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await PaymentModel.getUserPayments(userId);
    res.json(payments);
  } catch (error) {
    console.error("❌ Error fetching user payments:", error);
    res.status(500).json({ error: 'Failed to fetch payments', details: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await PaymentModel.getUserPayments(userId);
    res.json(payments);
  } catch (error) {
    console.error("❌ Error fetching user payments:", error);
    res.status(500).json({ error: 'Failed to fetch payments', details: error.message });
  }
};



exports.markOwnerPaid = async (req, res) => {
  const { paymentId } = req.params;  // Payment ID from the URL

  try {
    // Step 1: Fetch the payment details
    const payment = await paymentModel.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    // Step 2: Check if the payment is already marked as paid
    if (payment.PaidOut === 1) {
      return res.status(400).json({ message: "Owner has already been paid." });
    }

    // Step 3: Mark the owner as paid by updating the PaidOut field
    await paymentModel.markOwnerPaid(paymentId);

    // Step 4: Return success response
    res.status(200).json({ message: "Owner marked as paid successfully." });

  } catch (err) {
    console.error(`Error while marking payment as paid for paymentId ${paymentId}:`, err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
