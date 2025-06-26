import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "../../styles/user-profile.css";
import RenteeSidebar from "../../components/RenteeSidebar";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/users/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to change password');
        setLoading(false);
        return;
      }

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
      if (!token) {
        setError("Not authenticated. Please log in.");
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/users/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to delete account');
        return;
      }

      // Clear tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('vehicleOwnerToken');
      alert("Account deleted successfully. You will be redirected to the home page.");
      window.location.href = '/';
    } catch (err) {
      setError("An error occurred while deleting account. Please try again.");
    } finally {
      setDeleteModal(false);
    }
  };

  const confirmDeleteAccount = () => {
    setDeleteModal(true);
  };

  return (
    <div className="security-settings">
      <h5 className="section-title mb-3 enhanced-contrast-title">
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
                    disabled={loading}
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
                    placeholder="Enter new password (min 6 characters)"
                    disabled={loading}
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
                    disabled={loading}
                  />
                </FormGroup>
                <Button color="primary" type="submit" disabled={loading}>
                  <i className="ri-lock-line me-1"></i>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="account-actions-card mb-4">
            <CardBody>
              <h6 className="mb-3">Account Actions</h6>
              <div className="d-flex flex-column gap-3">
                <div className="action-item p-3 border rounded">
                  <h6 className="text-danger mb-2">
                    <i className="ri-delete-bin-line me-2"></i>
                    Delete Account
                  </h6>
                  <p className="text-muted mb-2 small">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button color="danger" size="sm" onClick={confirmDeleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Account Deletion
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <i className="ri-error-warning-line text-danger" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3 mb-3">Are you sure you want to delete your account?</h5>
            <p className="text-muted">
              This action is permanent and cannot be undone. All your data, including vehicles, reservations, and earnings will be permanently deleted.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </ModalFooter>
      </Modal>
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
          <RenteeSidebar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />

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
