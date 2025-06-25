import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "../styles/personal-info.css";

const ChauffeurPersonalInfo = () => {
  const [name, setName] = useState("John Doe");
  const [dob, setDob] = useState("1980-01-01");
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
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
              <h2>Personal Information</h2>
              <Form>
                <FormGroup>
                  <Label for="name">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="dob">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Profile Picture</Label>
                  <div className="profile-picture">
                    <img src={profilePic} alt="Profile" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-2"
                    />
                  </div>
                </FormGroup>
                <Button color="primary">Save Changes</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChauffeurPersonalInfo;
