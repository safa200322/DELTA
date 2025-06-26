import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Container, Row, Col, Button, Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "../styles/chauffeur-profile.css";

// --- Child Components with props ---
const PersonalInfo = ({ chauffeur }) => (
  <div className="profile-section">
    <h2>Personal Information</h2>
    <div className="section-content">
      <p><strong>Full Name:</strong> {chauffeur?.fullName || "N/A"}</p>
      <p><strong>Date of Birth:</strong> {chauffeur?.dob || "N/A"}</p>
      <div className="profile-picture">
        <Button color="primary">Upload New Picture</Button>
      </div>
    </div>
  </div>
);

const WorkAvailability = ({ chauffeur }) => {
  const [status, setStatus] = useState(chauffeur?.status || "Available");

  const handleStatusChange = () => {
    setStatus((prev) =>
      prev === "Available" ? "Unavailable" : prev === "Unavailable" ? "On a Job" : "Available"
    );
  };

  return (
    <div className="profile-section">
      <h2>Work & Availability</h2>
      <div className="section-content">
        <p><strong>Current Status:</strong> {status}</p>
        <Button color="primary" onClick={handleStatusChange} className="mb-3">
          Change Status
        </Button>
        <p><strong>Location:</strong> {chauffeur?.location || "Unknown"}</p>
        <div className="assigned-vehicles">
          <h4>Assigned Vehicle(s)</h4>
          <ul>
            {chauffeur?.vehicles?.map((vehicle, index) => (
              <li key={index}>
                {vehicle.name} - <Link to={`/reservation/${vehicle.id}`}>View Reservation</Link>{" "}
                <Button color="success" size="sm">Accept</Button>{" "}
                <Button color="danger" size="sm">Reject</Button>
              </li>
            )) || <li>No vehicles assigned</li>}
          </ul>
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
      <p><strong>Driving License:</strong> Uploaded (License #DL123456)</p>
      <Button color="primary">Upload New Document</Button>
    </div>
  </div>
);

const Settings = () => (
  <div className="profile-section">
    <h2>Settings</h2>
    <div className="section-content">
      <h4>Password & Security</h4>
      <Button color="primary" className="mb-3">Change Password</Button>
      <h4>Account Management</h4>
      <Button color="danger">Delete Account</Button>{" "}
      <Button color="warning">Deactivate Account</Button>
    </div>
  </div>
);

const PaymentInfo = () => (
  <div className="profile-section">
    <h2>Payment Info</h2>
    <div className="section-content">
      <p><strong>Total Earnings:</strong> $5,000</p>
      <h4>Recent Payouts</h4>
      <ul>
        <li>Payout #001: $500 on 05/15/2025</li>
        <li>Payout #002: $700 on 05/30/2025</li>
      </ul>
    </div>
  </div>
);

// --- Main Page ---
const ChauffeurProfilePage = () => {
  const [chauffeur, setChauffeur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:5000/api/chauffeurs/chauffeurs/login"); // replace with your API
        const data = await response.json();
        setChauffeur(data);
      } catch (error) {
        console.error("Error fetching chauffeur data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!chauffeur) return <div>No chauffeur data available.</div>;

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
              <Route path="personal-info" element={<PersonalInfo chauffeur={chauffeur} />} />
              <Route path="work-availability" element={<WorkAvailability chauffeur={chauffeur} />} />
              <Route path="booking-history" element={<BookingHistory />} />
              <Route path="documents-verification" element={<DocumentsVerification />} />
              <Route path="settings" element={<Settings />} />
              <Route path="payment-info" element={<PaymentInfo />} />
              <Route path="/" element={<PersonalInfo chauffeur={chauffeur} />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChauffeurProfilePage;
