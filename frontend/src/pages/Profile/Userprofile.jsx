import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const ProfileOverview = () => {
  const user = {
    name: "Umut Umutcuk",
    email: "umutcuk@gmail.com",
    phone: "+90 500 000 0000",
    profilePic: "https://i.pravatar.cc/150?img=3",
    isVerified: true,
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
            <Col lg="6">
              {/* Profile Overview Section */}
              <div className="enhanced-profile-card">
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="enhanced-profile-pic"
                />
                <div className="enhanced-profile-info">
                  <h3 className="enhanced-profile-name">{user.name}</h3>
                  <p className="enhanced-profile-detail">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="enhanced-profile-detail">
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p className="enhanced-profile-detail">
                    <strong>Verification:</strong>{" "}
                    {user.isVerified ? (
                      <span className="verified">ID Verified ✅</span>
                    ) : (
                      <span className="unverified">Not Verified ❌</span>
                    )}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ProfileOverview;
