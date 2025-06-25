import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const MyReviews = () => {
  const reviews = [
    {
      id: 1,
      vehicle: "Toyota Camry - Sedan",
      review: "Great car, very comfortable and reliable for long drives!",
      rating: 4,
      date: "June 15, 2025",
      editable: true,
    },
    {
      id: 2,
      vehicle: "Honda CR-V - SUV",
      review:
        "Spacious and good for family trips, but fuel economy could improve.",
      rating: 3,
      date: "June 10, 2025",
      editable: false,
    },
    {
      id: 3,
      vehicle: "Ford Focus - Compact",
      review: "Excellent handling, perfect for city driving.",
      rating: 5,
      date: "June 5, 2025",
      editable: true,
    },
  ];

  const handleEdit = (id) => {
    alert(`Editing review for ${reviews.find((r) => r.id === id).vehicle}`);
    // Add edit logic here
  };

  const handleRemove = (id) => {
    if (
      window.confirm(
        `Are you sure you want to remove the review for ${reviews.find((r) => r.id === id).vehicle
        }?`
      )
    ) {
      alert(`Review for ${reviews.find((r) => r.id === id).vehicle} removed!`);
      // Add removal logic here
    }
  };

  return (
    <div className="user-profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="sidebar-title">User Profile</h3>
        <Nav vertical className="sidebar-nav">
          <NavItem>
            <NavLink
              to="/profile/ProfileOverview"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-user-line"></i> Profile Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyRentals"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-briefcase-line"></i> My Rentals
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyPayments"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-calendar-line"></i> Payments & Wallet
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyReviews"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-file-text-line"></i> My Reviews
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/NotificationsProfile"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-settings-3-line"></i> Notifications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/AccountSettings"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-notification-3-fill"></i> Account Settings
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg="8">
              <div className="review-section">
                <h3 className="section-title">My Reviews</h3>
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-details">
                      <h4 className="review-vehicle">{review.vehicle}</h4>
                      <p className="review-text">{review.review}</p>
                      <p className="review-info">
                        <strong>Rating:</strong>{" "}
                        {Array(review.rating)
                          .fill()
                          .map((_, i) => (
                            <i
                              key={i}
                              className="ri-star-fill"
                              style={{ color: "#ffc107" }}
                            ></i>
                          ))}
                        {Array(5 - review.rating)
                          .fill()
                          .map((_, i) => (
                            <i
                              key={i + review.rating}
                              className="ri-star-line"
                              style={{ color: "#ccc" }}
                            ></i>
                          ))}
                      </p>
                      <p className="review-info">
                        <strong>Date:</strong> {review.date}
                      </p>
                      <div className="review-actions">
                        {review.editable && (
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(review.id)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="btn-remove"
                          onClick={() => handleRemove(review.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MyReviews;
