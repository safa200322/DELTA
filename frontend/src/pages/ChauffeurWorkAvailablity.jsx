import React, { useState } from "react";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "../styles/work-availability.css";

const ChauffeurWorkAvailability = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
              <div className="availability-grid">
                <div className="availability-item">
                  <h4>Monday</h4>
                  <p>9:00 AM - 5:00 PM</p>
                </div>
                <div className="availability-item">
                  <h4>Tuesday</h4>
                  <p>9:00 AM - 5:00 PM</p>
                </div>
                <div className="availability-item">
                  <h4>Wednesday</h4>
                  <p>9:00 AM - 5:00 PM</p>
                </div>
                <div className="availability-item">
                  <h4>Thursday</h4>
                  <p>9:00 AM - 5:00 PM</p>
                </div>
                <div className="availability-item">
                  <h4>Friday</h4>
                  <p>9:00 AM - 5:00 PM</p>
                </div>
                <div className="availability-item">
                  <h4>Saturday</h4>
                  <p>10:00 AM - 2:00 PM</p>
                </div>
                <div className="availability-item">
                  <h4>Sunday</h4>
                  <p>Unavailable</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChauffeurWorkAvailability;
