const ReviewModel = require('../models/reviewModel');

exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await ReviewModel.getReviewsByUserId(userId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
};

exports.deleteUserReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;
    const result = await ReviewModel.deleteReviewById(reviewId, userId);
    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review', details: error.message });
  }
};

exports.updateUserReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;
    const { stars, sentence } = req.body;
    const result = await ReviewModel.updateReviewById(reviewId, userId, stars, sentence);
    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or review not found' });
    }
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review', details: error.message });
  }
};
