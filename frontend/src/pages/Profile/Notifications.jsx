import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const NotificationsProfile = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get JWT token from localStorage (adjust if you store it elsewhere)
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/notifications/my", {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

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
              <div className="notification-section">
                <h3 className="section-title">Notifications</h3>
                {loading && <p>Loading notifications...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loading && !error && notifications.length === 0 && (
                  <p>No notifications found.</p>
                )}
                {!loading &&
                  !error &&
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-card ${notification.type}`}
                    >
                      <div className="notification-details">
                        <p className="notification-message">
                          {notification.message || notification.content}
                        </p>
                        {notification.createdAt && (
                          <p className="notification-timestamp">
                            <strong>Time:</strong>{" "}
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        )}
                        {notification.timestamp && !notification.createdAt && (
                          <p className="notification-timestamp">
                            <strong>Time:</strong> {notification.timestamp}
                          </p>
                        )}
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
