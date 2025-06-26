const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/authMiddleware');

// Create a new payment
router.post('/create', paymentController.createPayment);

// Get user payments
router.get('/my', authenticateToken, paymentController.getUserPayments);

// Mark owner as paid for a payment
router.patch('/markOwnerPaid/:paymentId', paymentController.markOwnerPaid);

module.exports = router;