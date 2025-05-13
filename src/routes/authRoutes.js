const express = require('express');
const {
  registerUser,
  loginUser,
  adminLogin,
  logoutUser
} = require('../controllers/authController');

const router = express.Router();

// RESTful User Routes
router.post('/users', registerUser); // register
router.post('/users/sessions', loginUser); // user login
router.post('/admins/sessions', adminLogin); // admin login
router.delete('/users/sessions', logoutUser); // logout

module.exports = router;
