const express = require('express');
const router = express.Router();
const bicycleFilterController = require('../controllers/bicycleFilterController');

router.get('/filterbicycle', bicycleFilterController.filterBicycles);

module.exports = router;
