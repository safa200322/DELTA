const db = require('../db');
const vehicleModel = require('../models/vehicleModel');
const accessoryModel = require('../models/accessoryModel');

const COMMISSION_RATES = {
  car: 0.15,
  boat: 0.20,
  motorcycle: 0.12,
  bicycle: 0.05
};

const FUEL_PRICE = {
  Petrol: 50,
  Diesel: 60,
  Electric: 20,
  Hybrid: 50
};

function calculateDays(startDate, endDate) {
  return Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
}

function calculateChauffeurAmount(startDate, endDate) {
  const dailyRate = 40; // $40 per day for chauffeur
  const days = calculateDays(startDate, endDate);
  return days * dailyRate;
}

async function calculateTotalPrice({ vehicleId, chauffeurId, accessoryId, startDate, endDate }) {
  const vehicle = await vehicleModel.getVehicleById(vehicleId);
  const vehiclePrice = vehicle.Price;
  const vehicleType = vehicle.Type;
  const fuelType = vehicle.FuelType;

  const accessoryPrice = accessoryId ? await accessoryModel.getAccessoryPrice(accessoryId) : 0;
  const chauffeurAmount = chauffeurId ? calculateChauffeurAmount(startDate, endDate) : 0;

  const commissionRate = COMMISSION_RATES[vehicleType] || 0;
  const commissionAmount = vehiclePrice * commissionRate;
  const fuelPrice = FUEL_PRICE[fuelType] || 0;

  const days = calculateDays(startDate, endDate);
  const totalPrice = (days * vehiclePrice) + accessoryPrice + chauffeurAmount + fuelPrice;
  const ownerEarnings = vehiclePrice - commissionAmount - fuelPrice;

  return {
    totalPrice,
    commissionAmount,
    ownerEarnings,
    chauffeurAmount
  };
}

const PaymentModel = {
  async createPayment(paymentData) {
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
  },

  async getUserPayments(userID) {
    const query = `
      SELECT 
        p.*, r.StartDate, r.EndDate, r.PickupLocation, r.DropoffLocation,
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' - ', m.Type)
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' - ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle - ', bi.Type)
          ELSE 'Unknown Vehicle'
        END as VehicleDetails,
        v.Type as VehicleType, v.VehiclePic, vo.FullName as OwnerName, vo.PhoneNumber as OwnerPhone,
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
    const query = `UPDATE Payment SET PaidOut = 1 WHERE PaymentID = ?`;
    const [result] = await db.execute(query, [paymentId]);
    return result;
  }
};

module.exports = { PaymentModel, calculateTotalPrice, calculateChauffeurAmount };
