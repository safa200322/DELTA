import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "../../styles/user-profile.css";

const AccountSettings = () => {
  const [user, setUser] = useState({
    name: "Umut Umutcuk",
    email: "umutcuk@gmail.com",
    phone: "+90 500 000 0000",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (user.newPassword === user.confirmPassword && user.newPassword) {
      alert("Password changed successfully!");
      setUser((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } else {
      alert("Passwords do not match or are empty!");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deleted successfully!");
      setShowDeleteConfirm(false);
      // Add deletion logic here
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
              <div className="settings-section">
                <h3 className="section-title">Account Settings</h3>

                {/* Personal Info */}
                <div className="settings-card">
                  <h4 className="settings-subtitle">Personal Info</h4>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={user.name}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={user.email}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={user.phone}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </div>

                {/* Password & Security */}
                <div className="settings-card">
                  <h4 className="settings-subtitle">Password & Security</h4>
                  <Form onSubmit={handlePasswordChange}>
                    <FormGroup>
                      <Label for="currentPassword">Current Password</Label>
                      <Input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={user.currentPassword}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="newPassword">New Password</Label>
                      <Input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={user.newPassword}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="confirmPassword">Confirm New Password</Label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <Button color="primary" type="submit">
                      Change Password
                    </Button>
                  </Form>
                </div>

                {/* Delete or Deactivate Account */}
                <div className="settings-card">
                  <h4 className="settings-subtitle">
                    Delete or Deactivate Account
                  </h4>
                  <p className="settings-warning">
                    This action will permanently delete your account and all
                    associated data.
                  </p>
                  {showDeleteConfirm ? (
                    <Button color="danger" onClick={handleDeleteAccount}>
                      Confirm Delete
                    </Button>
                  ) : (
                    <Button
                      color="warning"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Account
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AccountSettings;
