const express = require('express');
const router = express.Router();
const reservationadminController = require('../controllers/AdmingetReservationsController'); // path to your controller

const authenticateToken = require('../middleware/authMiddleware'); // path to your file

router.post('/create', authenticateToken, reservationadminController.createReservation);
router.get('/my', authenticateToken, reservationadminController.getUserReservations);
router.delete('/cancel/:id', authenticateToken, reservationadminController.cancelUserReservation);

// Admin
const adminAuth = require('../middleware/adminAuth');
router.get('/', reservationadminController.getAllReservations);
router.get('/:id', reservationadminController.getReservationById);
router.delete('/admin/:id', reservationadminController.deleteReservation);

module.exports = router;