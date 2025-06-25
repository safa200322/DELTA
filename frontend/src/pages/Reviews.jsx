import React from "react";
import { Container } from "reactstrap";
import "../styles/reviews.css";

const reviews = [
  {
    reviewID: 1,
    userName: "Ali Demir",
    stars: 5,
    sentence: "The vehicle was spotless and delivery was super quick. Excellent service!",
    createdAt: "2025-05-05 14:20",
  },
  {
    reviewID: 2,
    userName: "Elif Yılmaz",
    stars: 4,
    sentence: "The ride was smooth, but the interior could have been cleaner.",
    createdAt: "2025-05-06 09:10",
  },
  {
    reviewID: 3,
    userName: "Kemal Ay",
    stars: 3,
    sentence: "Fair value for the price, but the tires seemed worn.",
    createdAt: "2025-05-06 16:10",
  },
  {
    reviewID: 4,
    userName: "Buse Arı",
    stars: 5,
    sentence: "I rented based on reviews and I’m very satisfied. Will use again!",
    createdAt: "2025-05-07 12:15",
  },
  {
    reviewID: 5,
    userName: "Murat Şahin",
    stars: 4,
    sentence: "Fast delivery and friendly staff. Definitely recommend.",
    createdAt: "2025-05-07 18:45",
  },
];

const ReviewList = () => {
  return (
    <section className="review-section">
      <Container>
        <h3 className="mb-4">Customer Reviews</h3>
        {reviews.map((review) => (
          <div key={review.reviewID} className="review-card">
            <div className="review-header">
              <h5>{review.userName}</h5>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`ri-star-${i < review.stars ? "s-fill" : "s-line"}`} style={{ color: "#f9a826" }}></i>
                ))}
              </div>
            </div>
            <p className="review-date">{new Date(review.createdAt).toLocaleString()}</p>
            <p className="review-text">{review.sentence}</p>
          </div>
        ))}
      </Container>
    </section>
  );
};

export default ReviewList;
