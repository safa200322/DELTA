const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment
router.post('/create', paymentController.createPayment);

// Mark owner as paid for a payment
router.patch('/markOwnerPaid/:paymentId', paymentController.markOwnerPaid);

module.exports = router;