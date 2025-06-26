const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const adminAuth = require('../middleware/adminAuth');

// Get all payments (admin)
router.get('/', adminAuth, paymentController.getAllPayments);
// Accept payment
router.post('/:id/accepted', adminAuth, paymentController.acceptPayment);
// Reject payment
router.post('/:id/rejected', adminAuth, paymentController.rejectPayment);

module.exports = router;
