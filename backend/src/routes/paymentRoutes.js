
const express = require('express');
const PaymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create', auth, PaymentController.createPayment);

// Get user payments
router.get('/my', authenticateToken, PaymentController.getUserPayments);

// Get user payments
router.get('/my', authenticateToken, PaymentController.getUserPayments);
router.patch('/mark-paid/:paymentId', auth, PaymentController.markOwnerPaid);
module.exports = router;
