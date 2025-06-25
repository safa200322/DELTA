import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink as ReactstrapNavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "../styles/booking-history.css";

const ChauffeurBookingHistory = () => {
  const [activeTab, setActiveTab] = useState("past");
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
              <h2>Booking History</h2>
              <Nav tabs>
                <NavItem>
                  <ReactstrapNavLink
                    className={activeTab === "past" ? "active" : ""}
                    onClick={() => setActiveTab("past")}
                  >
                    Past Bookings
                  </ReactstrapNavLink>
                </NavItem>
                <NavItem>
                  <ReactstrapNavLink
                    className={activeTab === "upcoming" ? "active" : ""}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming Bookings
                  </ReactstrapNavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="past">
                  <ul>
                    <li>Booking #123: Completed on 05/20/2025 with User A</li>
                    <li>Booking #124: Completed on 05/25/2025 with User B</li>
                  </ul>
                </TabPane>
                <TabPane tabId="upcoming">
                  <ul>
                    <li>Booking #125: Scheduled for 06/10/2025 with User C</li>
                  </ul>
                </TabPane>
              </TabContent>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChauffeurBookingHistory;
