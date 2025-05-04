const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/pay", authenticateToken, paymentController.makePayment);

module.exports = router;
