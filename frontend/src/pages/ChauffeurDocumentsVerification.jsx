import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "../styles/chauffeur-profile.css";

const DocumentsVerification = () => {
  const [license, setLicense] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicense(URL.createObjectURL(file));
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
              <h2>Documents & Verification</h2>
              <FormGroup>
                <p>
                  <strong>Driving License:</strong>{" "}
                  {license ? "Uploaded" : "Not Uploaded"}
                </p>
                {license && (
                  <img
                    src={license}
                    alt="Driving License"
                    style={{ maxWidth: "200px" }}
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button color="primary" className="mt-2">
                  Upload Document
                </Button>
              </FormGroup>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DocumentsVerification;
