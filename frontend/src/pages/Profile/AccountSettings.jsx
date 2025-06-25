import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  Alert,
} from "reactstrap";
import "../../styles/user-profile.css";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch profile data');
        }

        const userData = await response.json();
        setUser(prevUser => ({
          ...prevUser,
          name: userData.fullName || userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load profile data");
        setMessageType("danger");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/auth/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: user.name,
          email: user.email,
          phone: user.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setMessageType("success");
      } else {
        setMessage(data.error || "Failed to update profile");
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
      setMessageType("danger");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (user.newPassword !== user.confirmPassword) {
      setMessage("New passwords do not match!");
      setMessageType("danger");
      return;
    }

    if (user.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters!");
      setMessageType("danger");
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/auth/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: user.currentPassword,
          newPassword: user.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully!");
        setMessageType("success");
        setUser((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setMessage(data.error || "Failed to change password");
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Failed to change password");
      setMessageType("danger");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/auth/users/profile', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          localStorage.removeItem('token');
          alert("Account deleted successfully!");
          navigate('/');
        } else {
          const data = await response.json();
          setMessage(data.error || "Failed to delete account");
          setMessageType("danger");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("Failed to delete account");
        setMessageType("danger");
      }
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

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
              <div className="settings-section">
                <h3 className="section-title">Account Settings</h3>

                {message && (
                  <Alert color={messageType} className="mb-3">
                    {message}
                  </Alert>
                )}

                {/* Personal Info */}
                <div className="settings-card">
                  <h4 className="settings-subtitle">Personal Info</h4>
                  <Form onSubmit={handleProfileUpdate}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={user.name}
                        onChange={handleChange}
                        required
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
                        required
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
                        required
                      />
                    </FormGroup>
                    <Button color="primary" type="submit">
                      Update Profile
                    </Button>
                  </Form>
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
                        required
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
                        required
                        minLength="6"
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
                        required
                        minLength="6"
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
