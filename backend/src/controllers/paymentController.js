const paymentModel = require('../models/paymentModel');
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

    const paymentResult = await paymentModel.createPayment({
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
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};
