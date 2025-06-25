const express = require('express');
const {
  registerUser,
  loginUser,
  adminLogin,
  logoutUser,
  getUserProfile
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// RESTful User Routes
router.post('/users', registerUser); // register
router.post('/users/sessions', loginUser); // user login
router.post('/admins/sessions', adminLogin); // admin login
router.delete('/users/sessions', logoutUser); // logout
router.get('/users/profile', authenticateToken, getUserProfile); // get user profile with JWT

module.exports = router;