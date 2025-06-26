// src/controllers/reservationController.js
const ReservationModel = require('../models/reservationModel');

const db = require('../db');

exports.createReservation = async (req, res) => {
  try {
    const reservationData = {
      ...req.body,
      UserID: req.user.id // from middleware (auth)
    };

    const result = await ReservationModel.createReservation(reservationData);

    await db.query(
      "UPDATE Vehicle SET Status = 'Rented' WHERE VehicleID = ?",
      [reservationData.VehicleID]
    );

    res.status(201).json({
      message: 'Reservation created successfully',
      reservationId: result.insertId
    });
  } catch (error) {
    console.error("❌ Error creating reservation:", error);
    res.status(500).json({ error: 'Failed to create reservation', details: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await ReservationModel.getReservationsByUserId(userId);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
  }
};

exports.cancelUserReservation = async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (isNaN(reservationId) || !userId) {
      return res.status(400).json({ error: 'Invalid reservation ID or unauthenticated user' });
    }

    const result = await ReservationModel.cancelReservationByUser(reservationId, userId);

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or reservation not found' });
    }

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error("❌ Error cancelling reservation:", error);
    res.status(500).json({ error: 'Failed to cancel reservation', details: error.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await ReservationModel.getAllReservations();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all reservations', details: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await ReservationModel.getReservationById(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation', details: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const result = await ReservationModel.deleteReservation(reservationId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation', details: error.message });
  }
};

exports.getVehicleOwnerReservations = async (req, res) => {
  try {
    const ownerID = req.user.id;
    const reservations = await ReservationModel.getReservationsByVehicleOwner(ownerID);
    res.json(reservations);
  } catch (error) {
    console.error("❌ Error fetching vehicle owner reservations:", error);
    res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
  }
};
