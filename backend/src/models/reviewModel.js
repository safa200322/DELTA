const db = require('../db');

const ReviewModel = {
  async getReviewsByUserId(userId) {
    const query = `
      SELECT r.reviewID, r.Stars, r.Sentence, r.createdAt, v.VehicleID,
        CASE 
          WHEN v.Type = 'Car' THEN CONCAT(c.Brand, ' ', c.Model, ' - ', c.Year)
          WHEN v.Type = 'Motorcycle' THEN CONCAT(m.Brand, ' ', m.Engine, 'cc - ', m.Year)
          WHEN v.Type = 'boats' THEN CONCAT(b.Brand, ' ', b.BoatType)
          WHEN v.Type = 'Bicycle' THEN CONCAT('Bicycle - ', bi.Type)
          ELSE 'Unknown Vehicle'
        END as VehicleDetails
      FROM Review r
      LEFT JOIN Reservation res ON r.userID = res.UserID
      LEFT JOIN Vehicle v ON res.VehicleID = v.VehicleID
      LEFT JOIN Car c ON v.VehicleID = c.VehicleID AND v.Type = 'Car'
      LEFT JOIN Motorcycle m ON v.VehicleID = m.VehicleID AND v.Type = 'Motorcycle'
      LEFT JOIN boats b ON v.VehicleID = b.VehicleID AND v.Type = 'boats'
      LEFT JOIN Bicycle bi ON v.VehicleID = bi.VehicleID AND v.Type = 'Bicycle'
      WHERE r.userID = ?
      ORDER BY r.createdAt DESC
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
  },

  async deleteReviewById(reviewId, userId) {
    const [result] = await db.query('DELETE FROM Review WHERE reviewID = ? AND userID = ?', [reviewId, userId]);
    return result;
  },

  async updateReviewById(reviewId, userId, stars, sentence) {
    const [result] = await db.query(
      'UPDATE Review SET Stars = ?, Sentence = ? WHERE reviewID = ? AND userID = ?',
      [stars, sentence, reviewId, userId]
    );
    return result;
  }
};

module.exports = ReviewModel;
