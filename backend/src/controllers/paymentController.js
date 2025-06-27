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
    console.log('[PAYMENT] Created:', paymentResult);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Get all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const [rows] = await require('../db').query('SELECT * FROM Payment');
    res.json(rows);
    console.log('[ADMIN][PAYMENT] All payments:', rows);
  } catch (error) {
    console.error('[ADMIN][PAYMENT] Get all payments error:', error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// Accept payment (admin)
exports.acceptPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const [result] = await require('../db').query('UPDATE Payment SET Status = ? WHERE PaymentID = ?', ['accepted', paymentId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment accepted' });
    console.log('[ADMIN][PAYMENT] Accepted payment:', paymentId);
  } catch (error) {
    console.error('[ADMIN][PAYMENT] Accept payment error:', error);
    res.status(500).json({ message: 'Error accepting payment', error: error.message });
  }
};

// Reject payment (admin)
exports.rejectPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const [result] = await require('../db').query('UPDATE Payment SET Status = ? WHERE PaymentID = ?', ['rejected', paymentId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment rejected' });
    console.log('[ADMIN][PAYMENT] Rejected payment:', paymentId);
  } catch (error) {
    console.error('[ADMIN][PAYMENT] Reject payment error:', error);
    res.status(500).json({ message: 'Error rejecting payment', error: error.message });
  }
};

// Get all payments for the authenticated user (rentee)
exports.getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    // Step 1: Get all ReservationIDs for this user
    const [reservations] = await require('../db').query('SELECT ReservationID FROM Reservation WHERE UserID = ?', [userId]);
    const reservationIds = reservations.map(r => r.ReservationID);
    if (reservationIds.length === 0) {
      return res.json([]); // No reservations, so no payments
    }
    // Step 2: Get all payments for these reservations
    const [payments] = await require('../db').query(
      `SELECT * FROM Payment WHERE ReservationID IN (${reservationIds.map(() => '?').join(',')})`,
      reservationIds
    );
    res.json(payments);
    console.log('[PAYMENT][USER] My payments:', payments);
  } catch (error) {
    console.error('[PAYMENT][USER] Get my payments error:', error);
    res.status(500).json({ message: 'Error fetching your payments', error: error.message });
  }
};
