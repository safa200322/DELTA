const express = require('express');
const {
  registerUser,
  loginUser,
  adminLogin,
  logoutUser,
  getUserProfile,
  updateProfilePicture
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

const router = express.Router();

// RESTful User Routes
router.post('/users', registerUser); // register
router.post('/users/sessions', loginUser); // user login
router.post('/admins/sessions', adminLogin); // admin login
router.delete('/users/sessions', logoutUser); // logout
router.get('/users/profile', authenticateToken, getUserProfile); // get user profile with JWT
router.post('/users/profile/picture', authenticateToken, upload.single('profilePicture'), updateProfilePicture); // upload profile picture

module.exports = router;