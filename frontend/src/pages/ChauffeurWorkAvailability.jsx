import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Nav, NavItem, NavLink } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "../styles/chauffeur-profile.css";

const WorkAvailability = () => {
  const [status, setStatus] = useState("Available");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState("");
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      setActionMsg("");
      try {
        const token = localStorage.getItem("token");
        // Decode JWT to get chauffeurId
        const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
        const chauffeurId = payload && (payload.id || payload.ChauffeurID);
        if (!chauffeurId) throw new Error("Invalid token or chauffeur ID");
        const res = await fetch(
          `http://localhost:5000/api/chauffeurs/assignments/pending/${chauffeurId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
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
    setStatus((prev) =>
      prev === "Available"
        ? "Unavailable"
        : prev === "Unavailable"
        ? "On a Job"
        : "Available"
    );
  };

  const handleAssignmentAction = async (reservationId, action) => {
    setError(null);
    setActionMsg("");
    try {
      const token = localStorage.getItem("token");
      // Decode JWT to get chauffeurId
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const chauffeurId = payload && (payload.id || payload.ChauffeurID);
      if (!chauffeurId) throw new Error("Invalid token or chauffeur ID");
      const res = await fetch(
        `http://localhost:5000/api/chauffeurs/assignments/respond/${reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ response: action, chauffeurId }),
        }
      );
      if (!res.ok) throw new Error("Failed to update assignment");
      setActionMsg(`Assignment ${action.toLowerCase()}ed successfully.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chauffeur-profile">
      <Container fluid>
        <Row>
          <Col
            xs="12"
            md="3"
            lg="2"
            className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
          >
            <div className="sidebar-header">
              <h3>Chauffeur Profile</h3>
              <i
                className="ri-menu-line sidebar-toggle d-md-none"
                onClick={toggleSidebar}
              ></i>
            </div>
            <Nav vertical className="sidebar-nav">
              <NavItem>
                <RouterNavLink
                  to="/profile/personal-info"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="ri-user-line"></i> Personal Info
                </RouterNavLink>
              </NavItem>
              <NavItem>
                <RouterNavLink
                  to="/profile/work-availability"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="ri-briefcase-line"></i> Work & Availability
                </RouterNavLink>
              </NavItem>
              <NavItem>
                <RouterNavLink
                  to="/profile/booking-history"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="ri-calendar-line"></i> Booking History
                </RouterNavLink>
              </NavItem>
              <NavItem>
                <RouterNavLink
                  to="/profile/documents-verification"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="ri-file-text-line"></i> Documents & Verification
                </RouterNavLink>
              </NavItem>
              <NavItem>
                <RouterNavLink
                  to="/profile/settings"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="ri-settings-3-line"></i> Settings
                </RouterNavLink>
              </NavItem>
              <NavItem>
                <RouterNavLink
                  to="/profile/payment-info"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <i className="ri-wallet-line"></i> Payment Info
                </RouterNavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col xs="12" md="9" lg="10" className="content-area">
            <div className="profile-section">
              <h2>Work & Availability</h2>
              <div className="section-content">
                <p>
                  <strong>Current Status:</strong> {status}
                </p>
                <Button
                  color="primary"
                  onClick={handleStatusChange}
                  className="mb-3"
                >
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
                          Reservation #{a.ReservationID} for {a.RenterName} (
                          {a.PhoneNumber})
                          <br />
                          <strong>From:</strong> {a.StartDate}{" "}
                          <strong>To:</strong> {a.EndDate}
                          <br />
                          <Button
                            color="success"
                            size="sm"
                            className="me-2"
                            onClick={() =>
                              handleAssignmentAction(a.ReservationID, "Accepted")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() =>
                              handleAssignmentAction(a.ReservationID, "Rejected")
                            }
                          >
                            Reject
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {actionMsg && <p className="text-success">{actionMsg}</p>}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WorkAvailability;
