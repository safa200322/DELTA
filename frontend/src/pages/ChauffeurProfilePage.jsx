import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import { Container, Row, Col, Button, Nav, NavItem } from "reactstrap";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";

import "remixicon/fonts/remixicon.css";
import "../styles/chauffeur-profile.css";

// Placeholder components for each section
const PersonalInfo = ({ profile, loading, error, successMsg, editMode, setEditMode, editData, handleEditChange, handleEditSubmit }) => (
  <div className="profile-section">
    <h2>Personal Information</h2>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-danger">{error}</p>
    ) : profile ? (
      <div className="section-content">
        {successMsg && <p className="text-success">{successMsg}</p>}
        {!editMode ? (
          <>
            <p>
              <strong>Full Name:</strong> {profile.Name}
            </p>
            <p>
              <strong>Date of Birth:</strong> {profile.Date_of_birth}
            </p>
            <p>
              <strong>Email:</strong> {profile.Email}
            </p>
            <p>
              <strong>Phone:</strong> {profile.PhoneNumber}
            </p>
            <p>
              <strong>Location:</strong> {profile.Location}
            </p>
            <Button color="primary" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          </>
        ) : (
          <form onSubmit={handleEditSubmit}>
            <div className="mb-2">
              <label>Full Name</label>
              <input name="Name" value={editData.Name || ""} onChange={handleEditChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Date of Birth</label>
              <input name="Date_of_birth" value={editData.Date_of_birth || ""} onChange={handleEditChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Email</label>
              <input name="Email" value={editData.Email || ""} onChange={handleEditChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Phone</label>
              <input name="PhoneNumber" value={editData.PhoneNumber || ""} onChange={handleEditChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Location</label>
              <input name="Location" value={editData.Location || ""} onChange={handleEditChange} className="form-control" />
            </div>
            <Button color="success" type="submit">
              Save
            </Button>{" "}
            <Button color="secondary" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </form>
        )}
      </div>
    ) : null}
  </div>
);

const WorkAvailability = () => {
  const [status, setStatus] = useState("Available");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      setActionMsg("");
      try {
        const token = localStorage.getItem("token");
        // Decode JWT to get chauffeurId
        const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
        const chauffeurId = payload && (payload.id || payload.ChauffeurID);
        if (!chauffeurId) throw new Error("Invalid token or chauffeur ID");
        const res = await fetch(`http://localhost:5000/api/chauffeurs/assignments/pending/${chauffeurId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [actionMsg]);

  const handleStatusChange = () => {
    setStatus((prev) => (prev === "Available" ? "Unavailable" : prev === "Unavailable" ? "On a Job" : "Available"));
  };

  const handleAssignmentAction = async (reservationId, action) => {
    setError(null);
    setActionMsg("");
    try {
      const token = localStorage.getItem("token");
      // Decode JWT to get chauffeurId
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const chauffeurId = payload && (payload.id || payload.ChauffeurID);
      if (!chauffeurId) throw new Error("Invalid token or chauffeur ID");
      const res = await fetch(`http://localhost:5000/api/chauffeurs/assignments/respond/${reservationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ response: action, chauffeurId }),
      });
      if (!res.ok) throw new Error("Failed to update assignment");
      setActionMsg(`Assignment ${action.toLowerCase()}ed successfully.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-section">
      <h2>Work & Availability</h2>
      <div className="section-content">
        <p>
          <strong>Current Status:</strong> {status}
        </p>
        <Button color="primary" onClick={handleStatusChange} className="mb-3">
          Change Status
        </Button>
        <div className="assigned-vehicles">
          <h4>Assigned Reservations</h4>
          {loading ? (
            <p>Loading assignments...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : assignments.length === 0 ? (
            <p>No pending assignments.</p>
          ) : (
            <ul>
              {assignments.map((a) => (
                <li key={a.ReservationID}>
                  Reservation #{a.ReservationID} for {a.RenterName} ({a.PhoneNumber})
                  <br />
                  <strong>From:</strong> {a.StartDate} <strong>To:</strong> {a.EndDate}
                  <br />
                  <Button color="success" size="sm" onClick={() => handleAssignmentAction(a.ReservationID, "Accepted")}>Accept</Button>{' '}
                  <Button color="danger" size="sm" onClick={() => handleAssignmentAction(a.ReservationID, "Rejected")}>Reject</Button>
                </li>
              ))}
            </ul>
          )}
          {actionMsg && <p className="text-success">{actionMsg}</p>}
        </div>
      </div>
    </div>
  );
};

const BookingHistory = () => (
  <div className="profile-section">
    <h2>Booking History</h2>
    <div className="section-content">
      <h4>Past Bookings</h4>
      <ul>
        <li>Booking #123: Completed on 05/20/2025 with User A</li>
        <li>Booking #124: Completed on 05/25/2025 with User B</li>
      </ul>
      <h4>Upcoming Bookings</h4>
      <ul>
        <li>Booking #125: Scheduled for 06/10/2025 with User C</li>
      </ul>
    </div>
  </div>
);

const DocumentsVerification = () => (
  <div className="profile-section">
    <h2>Documents & Verification</h2>
    <div className="section-content">
      <p>
        <strong>Driving License:</strong> Uploaded (License #DL123456)
      </p>
      <Button color="primary">Upload New Document</Button>
    </div>
  </div>
);

const Settings = () => (
  <div className="profile-section">
    <h2>Settings</h2>
    <div className="section-content">
      <h4>Password & Security</h4>
      <Button color="primary" className="mb-3">
        Change Password
      </Button>
      <h4>Account Management</h4>
      <Button color="danger">Delete Account</Button> <Button color="warning">Deactivate Account</Button>
    </div>
  </div>
);

const PaymentInfo = () => (
  <div className="profile-section">
    <h2>Payment Info</h2>
    <div className="section-content">
      <p>
        <strong>Total Earnings:</strong> $5,000
      </p>
      <h4>Recent Payouts</h4>
      <ul>
        <li>Payout #001: $500 on 05/15/2025</li>
        <li>Payout #002: $700 on 05/30/2025</li>
      </ul>
    </div>
  </div>
);

const ChauffeurProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/chauffeurs/me", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        setEditData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/chauffeurs/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSuccessMsg("Profile updated successfully.");
      setEditMode(false);
      setProfile(editData);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="chauffeur-profile">
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col xs="12" md="3" lg="2" className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
            <div className="sidebar-header">
              <h3>Chauffeur Profile</h3>
              <i className="ri-menu-line sidebar-toggle d-md-none" onClick={toggleSidebar}></i>
            </div>
            <Nav vertical className="sidebar-nav">
              <NavItem>
                <NavLink to="/profile/personal-info" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <i className="ri-user-line"></i> Personal Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/work-availability" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <i className="ri-briefcase-line"></i> Work & Availability
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/booking-history" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <i className="ri-calendar-line"></i> Booking History
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/documents-verification" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <i className="ri-file-text-line"></i> Documents & Verification
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <i className="ri-settings-3-line"></i> Settings
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/payment-info" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                  <i className="ri-wallet-line"></i> Payment Info
                </NavLink>
              </NavItem>
            </Nav>
          </Col>

          {/* Content Area */}
          <Col xs="12" md="9" lg="10" className="content-area">
            <Routes>
              <Route path="personal-info" element={<PersonalInfo profile={profile} loading={loading} error={error} successMsg={successMsg} editMode={editMode} setEditMode={setEditMode} editData={editData} handleEditChange={handleEditChange} handleEditSubmit={handleEditSubmit} />} />
              <Route path="work-availability" element={<WorkAvailability />} />
              <Route path="booking-history" element={<BookingHistory />} />
              <Route path="documents-verification" element={<DocumentsVerification />} />
              <Route path="settings" element={<Settings />} />
              <Route path="payment-info" element={<PaymentInfo />} />
              <Route path="/" element={<PersonalInfo profile={profile} loading={loading} error={error} successMsg={successMsg} editMode={editMode} setEditMode={setEditMode} editData={editData} handleEditChange={handleEditChange} handleEditSubmit={handleEditSubmit} />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChauffeurProfilePage;
