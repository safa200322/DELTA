const db = require('../db');
const vehicleModel = require('../models/vehicleModel');
const accessoryModel = require('../models/accessoryModel');

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

// Function to calculate chauffeur amount
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

// Function to create payment record
exports.createPayment = async (paymentData) => {
  const query = `
    INSERT INTO Payment (
      ReservationID, Status, NameOnCard, CardNumber, ExpiryDate, 
      CVV, PaymentMethod, TotalPrice, CommissionRate, CommissionAmount, 
      ChauffeurAmount, OwnerEarning, PaidOut
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.query(query, [
    paymentData.ReservationID,
    paymentData.Status,
    paymentData.NameOnCard,
    paymentData.CardNumber,
    paymentData.ExpiryDate,
    paymentData.CVV,
    paymentData.PaymentMethod,
    paymentData.TotalPrice,
    paymentData.CommissionRate,
    paymentData.CommissionAmount,
    paymentData.ChauffeurAmount,
    paymentData.OwnerEarning,
    paymentData.PaidOut
  ]);

  return result;
};

// Function to update payment status (e.g., marking owner as paid)
exports.updatePaymentStatus = async (paymentId, status) => {
  const query = `
    UPDATE Payment
    SET Status = ?
    WHERE PaymentID = ?
  `;
  const [result] = await db.query(query, [status, paymentId]);
  return result;
};

// Function to get payment info by reservation ID (to ensure it's linked correctly)
exports.getPaymentByReservation = async (reservationId) => {
  const query = `SELECT * FROM Payment WHERE ReservationID = ?`;
  const [rows] = await db.query(query, [reservationId]);
  return rows[0];
};
