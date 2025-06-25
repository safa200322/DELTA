const express = require('express');
const router = express.Router();

const vehicleOwnerController = require('../controllers/vehicleOwnerController');
const vehicleOwnerAuth = require('../middleware/vehicleOwnerAuth');

router.post('/register', vehicleOwnerController.register);
router.post('/login', vehicleOwnerController.login);

router.get('/profile', vehicleOwnerAuth, (req, res) => {
  res.json({ message: 'Welcome, vehicle owner!', ownerId: req.vehicleOwner.id });
});

module.exports = router;
