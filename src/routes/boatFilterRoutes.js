const express = require('express');
const router = express.Router();
const boatFilterController = require('../controllers/boatFilterController');

// Example: /api/boats/filter?brand=Yamaha&boatType=Jet&minPrice=1000
router.get('/filter', boatFilterController.filterBoats);

module.exports = router;
