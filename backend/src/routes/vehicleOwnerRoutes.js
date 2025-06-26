const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const vehicleOwnerController = require('../controllers/vehicleOwnerController');
const vehicleOwnerAuth = require('../middleware/vehicleOwnerAuth');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/profile-pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'owner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/register', vehicleOwnerController.register);
router.post('/login', vehicleOwnerController.login);

// Protected routes
router.get('/profile', vehicleOwnerAuth, vehicleOwnerController.getProfile);
router.put('/profile', vehicleOwnerAuth, vehicleOwnerController.updateProfile);
router.post('/profile/picture', vehicleOwnerAuth, upload.single('profilePicture'), vehicleOwnerController.updateProfilePicture);
router.get('/vehicles', vehicleOwnerAuth, vehicleOwnerController.getMyVehicles);
router.get('/earnings', vehicleOwnerAuth, vehicleOwnerController.getEarnings);

module.exports = router;
