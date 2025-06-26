import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Alert, Spinner } from "reactstrap";

const ChauffeurSettings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  // Change password handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/chauffeurs/me/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ password }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }
      setSuccess("Password changed successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete account handler
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account? This cannot be undone."
      )
    )
      return;
    setError("");
    setSuccess("");
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/chauffeurs/me", {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account");
      }
      setSuccess("Account deleted. You will be logged out.");
      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Deactivate account handler
  const handleDeactivate = async () => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate your account? You can reactivate by contacting support."
      )
    )
      return;
    setError("");
    setSuccess("");
    setDeactivating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/chauffeurs/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ Status: "Deactivated" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to deactivate account");
      }
      setSuccess("Account deactivated. You will be logged out.");
      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>Settings</h2>
      <Form onSubmit={handlePasswordChange}>
        <h4>Password & Security</h4>
        <FormGroup>
          <Label for="password">New Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={loading}
          />
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={loading}
          />
        </FormGroup>
        <Button
          color="primary"
          className="mb-3"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Change Password"}
        </Button>
        {success && <Alert color="success">{success}</Alert>}
        {error && <Alert color="danger">{error}</Alert>}
        <h4>Account Management</h4>
        <Button
          color="danger"
          className="me-2"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? <Spinner size="sm" /> : "Delete Account"}
        </Button>
        <Button
          color="warning"
          onClick={handleDeactivate}
          disabled={deactivating}
        >
          {deactivating ? <Spinner size="sm" /> : "Deactivate Account"}
        </Button>
      </Form>
    </div>
  );
};

export default ChauffeurSettings;
