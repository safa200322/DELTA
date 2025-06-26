
const express = require('express');
const PaymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', auth, PaymentController.createPayment);

router.patch('/mark-paid/:paymentId', auth, PaymentController.markOwnerPaid);  
module.exports = router;
