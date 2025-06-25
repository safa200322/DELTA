const express = require('express');
const router = express.Router();
const motorcycleFilterController = require('../controllers/motorcycleFilterController');

router.get('/filtermotor', motorcycleFilterController.filterMotorcycles);

module.exports = router;
