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
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "../../styles/user-profile.css";

// Sample vehicle data (replace with actual data from API or state management)
const vehicles = [
  {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    type: "Sedan",
    thumbnail: "https://i.pravatar.cc/150?img=5", // Replace with actual vehicle image
    status: "available",
  },
  {
    id: 2,
    brand: "Honda",
    model: "CR-V",
    type: "SUV",
    thumbnail: "https://i.pravatar.cc/150?img=6",
    status: "rented",
  },
  {
    id: 3,
    brand: "Ford",
    model: "F-150",
    type: "Truck",
    thumbnail: "https://i.pravatar.cc/150?img=7",
    status: "maintenance",
  },
];

const VehicleManagement = () => {
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return <Badge color="success">Available</Badge>;
      case "rented":
        return <Badge color="warning">Rented</Badge>;
      case "maintenance":
        return <Badge color="danger">Maintenance</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="vehicle-management">
      <h5 className="section-title mb-3">
        <i className="ri-car-line me-2 text-primary"></i>
        My Vehicles
      </h5>
      <Row>
        {vehicles.map((vehicle) => (
          <Col md="6" lg="4" key={vehicle.id} className="mb-4">
            <Card className="vehicle-card">
              <img
                src={vehicle.thumbnail}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="vehicle-thumbnail"
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <CardBody>
                <h6 className="vehicle-title">
                  {vehicle.brand} {vehicle.model}
                </h6>
                <p className="text-muted mb-2">Type: {vehicle.type}</p>
                <p className="mb-2">Status: {getStatusBadge(vehicle.status)}</p>
                <div className="vehicle-actions d-flex gap-2">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() =>
                      alert(
                        `Uploading maintenance for ${vehicle.brand} ${vehicle.model}`
                      )
                    }
                  >
                    <i className="ri-file-upload-line me-1"></i>
                    Maintenance
                  </Button>
                  <Button
                    color="info"
                    size="sm"
                    onClick={() =>
                      alert(
                        `Viewing rental history for ${vehicle.brand} ${vehicle.model}`
                      )
                    }
                  >
                    <i className="ri-history-line me-1"></i>
                    History
                  </Button>
                  <Dropdown
                    isOpen={dropdownOpen[vehicle.id] || false}
                    toggle={() => toggleDropdown(vehicle.id)}
                  >
                    <DropdownToggle caret color="danger" size="sm">
                      <i className="ri-more-fill"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() =>
                          alert(`Removing ${vehicle.brand} ${vehicle.model}`)
                        }
                      >
                        Remove Vehicle
                      </DropdownItem>
                      <DropdownItem
                        onClick={() =>
                          alert(
                            `Deactivating ${vehicle.brand} ${vehicle.model}`
                          )
                        }
                      >
                        Deactivate Vehicle
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const RenteeVehicleManagement = () => {
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
                <div className="placeholder-text mb-4">
                  <h3>Vehicle Management </h3>
                  {/* <p>
                    This section will display user profile and payment details
                    in the future.
                  </p> */}
                </div>
                <VehicleManagement />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeVehicleManagement;
