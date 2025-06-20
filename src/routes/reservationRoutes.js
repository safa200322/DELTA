const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticateToken = require('../middleware/authMiddleware'); // path to your file

router.post('/create', authenticateToken, reservationController.createReservation);
router.get('/my', authenticateToken, reservationController.getUserReservations);
router.delete('/cancel/:id', authenticateToken, reservationController.cancelUserReservation);

// Admin
const adminAuth = require('../middleware/adminAuth');
router.get('/', adminAuth, reservationController.getAllReservations);
router.get('/:id', adminAuth, reservationController.getReservationById);
router.delete('/admin/:id', adminAuth, reservationController.deleteReservation);

module.exports = router;
