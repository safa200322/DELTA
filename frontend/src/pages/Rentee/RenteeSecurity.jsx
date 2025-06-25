import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import "../../styles/user-profile.css";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // Replace with actual password change logic (e.g., API call)
    setSuccess("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeactivateAccount = () => {
    // Replace with actual deactivate account logic (e.g., API call)
    alert("Account deactivation requested.");
  };

  const handleDeleteAccount = () => {
    // Replace with actual delete account logic (e.g., API call)
    alert("Account deletion requested.");
  };

  return (
    <div className="security-settings">
      <h5 className="section-title mb-3">
        <i className="ri-lock-line me-2 text-primary"></i>
        Password & Security
      </h5>
      <Row>
        <Col lg="6">
          <Card className="password-card mb-4">
            <CardBody>
              <h6 className="mb-3">Change Password</h6>
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}
              <form onSubmit={handlePasswordChange}>
                <FormGroup>
                  <Label for="currentPassword">Current Password</Label>
                  <Input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="newPassword">New Password</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="confirmPassword">Confirm New Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </FormGroup>
                <Button color="primary" type="submit">
                  <i className="ri-lock-line me-1"></i>
                  Change Password
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="account-actions-card mb-4">
            <CardBody>
              <h6 className="mb-3">Account Actions</h6>
              <div className="d-flex flex-column gap-2">
                <Button color="warning" onClick={handleDeactivateAccount}>
                  <i className="ri-pause-circle-line me-1"></i>
                  Deactivate Account
                </Button>
                <Button color="danger" onClick={handleDeleteAccount}>
                  <i className="ri-delete-bin-line me-1"></i>
                  Delete Account
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const RenteeSecurity = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <section style={{ marginTop: "10px" }}>
      <Container fluid>
        <Row>
          <Col
            xs="12"
            md="3"
            lg="2"
            className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
          >
            <div className="sidebar-header">
              <h3>Rentee Profile</h3>
              <i
                className="ri-menu-line sidebar-toggle d-md-none"
                onClick={toggleSidebar}
              ></i>
            </div>
            <Nav vertical className="sidebar-nav">
              <NavItem>
                <NavLink to="/profile/rentee-profile" className="nav-link">
                  <i className="ri-user-line"></i> Personal Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-vehicle-management"
                  className="nav-link"
                >
                  <i className="ri-briefcase-line"></i> Vehicle Management
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-rental-reservations"
                  className="nav-link"
                >
                  <i className="ri-calendar-line"></i> Rental reservations
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-earnings-and-payments"
                  className="nav-link"
                >
                  <i className="ri-file-text-line"></i> Earnings & Payments
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-maintenance-and-documents"
                  className="nav-link"
                >
                  <i className="ri-settings-3-line"></i> Maintenance & Documents
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-notifications"
                  className="nav-link"
                >
                  <i className="ri-wallet-line"></i> Notifications
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-reviews" className="nav-link">
                  <i className="ri-wallet-line"></i> Reviews
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-security" className="nav-link">
                  <i className="ri-wallet-line"></i> Security
                </NavLink>
              </NavItem>
            </Nav>
          </Col>

          <Col xs="12" md="9" lg="10" className="content-area">
            <Row className="mt-4">
              <Col lg="12">
                <SecuritySettings />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeSecurity;
