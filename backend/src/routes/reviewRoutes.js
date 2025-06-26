const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/my', authenticateToken, reviewController.getUserReviews);
router.delete('/:id', authenticateToken, reviewController.deleteUserReview);
router.put('/:id', authenticateToken, reviewController.updateUserReview);

module.exports = router;
