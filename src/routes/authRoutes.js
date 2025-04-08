const express = require('express');
const { registerUser, loginUser, adminLogin } = require('../controllers/authController');

const router = express.Router();




// ✅ User Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);

// ✅ Logout Route (Fix: Use `req.session.destroy()`)
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;
