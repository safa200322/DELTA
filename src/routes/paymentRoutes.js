const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');

// Protected routes
router.post('/success', verifyToken, paymentController.mockPaymentSuccess);
router.post('/fail', verifyToken, paymentController.mockPaymentFail);

module.exports = router;
