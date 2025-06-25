import React, { useState } from "react";
import { Container, Row, Col, Button, Nav, NavItem, NavLink } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "../styles/chauffeur-profile.css";

const WorkAvailability = () => {
  const [status, setStatus] = useState("Available");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleStatusChange = () => {
    setStatus((prev) =>
      prev === "Available"
        ? "Unavailable"
        : prev === "Unavailable"
        ? "On a Job"
        : "Available"
    );
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
                <p>
                  <strong>Location:</strong> Famagusta, North Cyprus
                </p>
                <div className="assigned-vehicles">
                  <h4>Assigned Vehicle(s)</h4>
                  <ul>
                    <li>
                      Vehicle 1: Sedan -{" "}
                      <Link to="/reservation/1">View Reservation</Link>{" "}
                      <Button color="success" size="sm" className="me-2">
                        Accept
                      </Button>
                      <Button color="danger" size="sm">
                        Reject
                      </Button>
                    </li>
                    <li>
                      Vehicle 2: SUV -{" "}
                      <Link to="/reservation/2">View Reservation</Link>{" "}
                      <Button color="success" size="sm" className="me-2">
                        Accept
                      </Button>
                      <Button color="danger" size="sm">
                        Reject
                      </Button>
                    </li>
                  </ul>
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
