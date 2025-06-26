const Payment = require('../models/payment.model');

exports.createPayment = async (req, res) => {
  try {
    const {
      ReservationID,
      VehicleID,
      AccessoryID,
      ChauffeurID,
      NameOnCard,
      CardNumber,
      ExpiryDate,
      CVV,
      PaymentMethod
    } = req.body;

    // Step 1: Call model function to create the payment
    const paymentResult = await Payment.createPayment({
      ReservationID,
      VehicleID,
      AccessoryID,
      ChauffeurID,
      NameOnCard,
      CardNumber,
      ExpiryDate,
      CVV,
      PaymentMethod
    });

    res.status(201).json({
      message: 'Payment created successfully',
      payment: paymentResult
    });
  } catch (error) {
    console.error('❌ Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};
