import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const NotificationsProfile = () => {
  const notifications = [
    {
      id: 1,
      type: "owner",
      message:
        "John Doe has updated the pickup time for your Toyota Camry to 10:30 AM.",
      timestamp: "June 20, 2025, 09:00 PM +03",
    },
    {
      id: 2,
      type: "rental",
      message:
        "Your rental of Honda CR-V has been confirmed for June 21-23, 2025.",
      timestamp: "June 20, 2025, 08:45 PM +03",
    },
    {
      id: 3,
      type: "admin",
      message: "New platform update: Enhanced security features are now live!",
      timestamp: "June 20, 2025, 09:15 PM +03",
    },
    {
      id: 4,
      type: "owner",
      message:
        "Jane Smith has requested maintenance details for your Ford Focus.",
      timestamp: "June 19, 2025, 03:00 PM +03",
    },
  ];

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
              to="/profile/MyRentalst"
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
              <div className="notification-section">
                <h3 className="section-title">Notifications</h3>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-card ${notification.type}`}
                  >
                    <div className="notification-details">
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      <p className="notification-timestamp">
                        <strong>Time:</strong> {notification.timestamp}
                      </p>
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

export default NotificationsProfile;
