const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticateToken = require('../middleware/authMiddleware'); // path to your file

router.post('/create', authenticateToken, reservationController.createReservation);
router.get('/my', authenticateToken, reservationController.getUserReservations);
router.delete('/cancel/:id', authenticateToken, reservationController.cancelUserReservation);

// Vehicle owner routes
const vehicleOwnerAuth = require('../middleware/vehicleOwnerAuth');
router.get('/my-vehicles', vehicleOwnerAuth, reservationController.getVehicleOwnerReservations);

// Admin
const adminAuth = require('../middleware/adminAuth');
router.get('/', adminAuth, reservationController.getAllReservations);
router.get('/:id', adminAuth, reservationController.getReservationById);
router.delete('/admin/:id', adminAuth, reservationController.deleteReservation);

module.exports = router;
