import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  Card,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "../../styles/user-profile.css";

const MaintenanceAndDocuments = () => {
  const [maintenanceFile, setMaintenanceFile] = useState(null);
  const [inspectionFile, setInspectionFile] = useState(null);

  const handleMaintenanceFileChange = (e) => {
    setMaintenanceFile(e.target.files[0]);
  };

  const handleInspectionFileChange = (e) => {
    setInspectionFile(e.target.files[0]);
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    const file = type === "maintenance" ? maintenanceFile : inspectionFile;
    if (file) {
      alert(`Uploading ${type} file: ${file.name}`);
      // Replace with actual file upload logic (e.g., API call)
    } else {
      alert(`Please select a ${type} file to upload.`);
    }
  };

  return (
    <div className="maintenance-documents">
      <h5 className="section-title mb-3">
        <i className="ri-settings-3-line me-2 text-primary"></i>
        Maintenance & Documents
      </h5>
      <Row>
        <Col lg="6">
          <Card className="upload-card mb-4">
            <CardBody>
              <h6 className="mb-3">Upload Maintenance History</h6>
              <FormGroup>
                <Label for="maintenanceFile">Select Maintenance File</Label>
                <Input
                  type="file"
                  name="maintenanceFile"
                  id="maintenanceFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleMaintenanceFileChange}
                />
                <small className="text-muted">
                  Accepted formats: PDF, DOC, DOCX
                </small>
              </FormGroup>
              <Button
                color="primary"
                onClick={(e) => handleSubmit(e, "maintenance")}
                disabled={!maintenanceFile}
              >
                <i className="ri-file-upload-line me-1"></i>
                Upload Maintenance History
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="upload-card mb-4">
            <CardBody>
              <h6 className="mb-3">Upload Inspection Report</h6>
              <FormGroup>
                <Label for="inspectionFile">Select Inspection Report</Label>
                <Input
                  type="file"
                  name="inspectionFile"
                  id="inspectionFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleInspectionFileChange}
                />
                <small className="text-muted">
                  Accepted formats: PDF, DOC, DOCX
                </small>
              </FormGroup>
              <Button
                color="primary"
                onClick={(e) => handleSubmit(e, "inspection")}
                disabled={!inspectionFile}
              >
                <i className="ri-file-upload-line me-1"></i>
                Upload Inspection Report
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const RenteeMaintaninceandDocuments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <section style={{ marginTop: "10px" }}>
      <Container fluid>
        <Row>
          <Col
            xs="12"
            md="3"
            lg="2"
            className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
          >
            <div className="sidebar-header">
              <h3>Rentee Profile</h3>
              <i
                className="ri-menu-line sidebar-toggle d-md-none"
                onClick={toggleSidebar}
              ></i>
            </div>
            <Nav vertical className="sidebar-nav">
              <NavItem>
                <NavLink to="/profile/rentee-profile" className="nav-link">
                  <i className="ri-user-line"></i> Personal Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-vehicle-management"
                  className="nav-link"
                >
                  <i className="ri-briefcase-line"></i> Vehicle Management
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-rental-reservations"
                  className="nav-link"
                >
                  <i className="ri-calendar-line"></i> Rental reservations
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-earnings-and-payments"
                  className="nav-link"
                >
                  <i className="ri-file-text-line"></i> Earnings & Payments
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-maintenance-and-documents"
                  className="nav-link"
                >
                  <i className="ri-settings-3-line"></i> Maintenance & Documents
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/profile/rentee-notifications"
                  className="nav-link"
                >
                  <i className="ri-wallet-line"></i> Notifications
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-reviews" className="nav-link">
                  <i className="ri-wallet-line"></i> Reviews
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-security" className="nav-link">
                  <i className="ri-wallet-line"></i> Security
                </NavLink>
              </NavItem>
            </Nav>
          </Col>

          <Col xs="12" md="9" lg="10" className="content-area">
            <Row className="mt-4">
              <Col lg="12">
                <MaintenanceAndDocuments />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeMaintaninceandDocuments;
