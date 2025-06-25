import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem, Card, CardBody, Badge } from "reactstrap";
import "../../styles/user-profile.css";

// Sample reservation data (replace with actual data from API or state management)
const reservations = [
  {
    id: 1,
    renterName: "John Doe",
    rating: 4.5,
    startDate: "2025-07-01",
    endDate: "2025-07-07",
    status: "pending",
  },
  {
    id: 2,
    renterName: "Jane Smith",
    rating: 4.8,
    startDate: "2025-07-10",
    endDate: "2025-07-15",
    status: "accepted",
  },
  {
    id: 3,
    renterName: "Alice Johnson",
    rating: 3.9,
    startDate: "2025-06-20",
    endDate: "2025-06-25",
    status: "completed",
  },
  {
    id: 4,
    renterName: "Bob Wilson",
    rating: 4.2,
    startDate: "2025-07-20",
    endDate: "2025-07-25",
    status: "declined",
  },
];

const ReservationList = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge color="warning">Pending</Badge>;
      case "accepted":
        return <Badge color="success">Accepted</Badge>;
      case "declined":
        return <Badge color="danger">Declined</Badge>;
      case "completed":
        return <Badge color="primary">Completed</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="reservation-list">
      <h5 className="section-title mb-3">
        <i className="ri-calendar-line me-2 text-primary"></i>
        Incoming Reservations
      </h5>
      <Row>
        {reservations.map((reservation) => (
          <Col md="6" lg="4" key={reservation.id} className="mb-4">
            <Card className="reservation-card">
              <CardBody>
                <h6 className="reservation-title">{reservation.renterName}</h6>
                <p className="text-muted mb-2">
                  Rating: {reservation.rating} <i className="ri-star-fill text-warning"></i>
                </p>
                <p className="mb-2">
                  Rental Period: {reservation.startDate} to {reservation.endDate}
                </p>
                <p className="mb-0">Status: {getStatusBadge(reservation.status)}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const RenteeRentalReservations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <section style={{ marginTop: "10px" }}>
      <Container fluid>
        <Row>
          <Col xs="12" md="3" lg="2" className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
            <div className="sidebar-header">
              <h3>Rentee Profile</h3>
              <i className="ri-menu-line sidebar-toggle d-md-none" onClick={toggleSidebar}></i>
            </div>
            <Nav vertical className="sidebar-nav">
              <NavItem>
                <NavLink to="/profile/rentee-profile" className="nav-link">
                  <i className="ri-user-line"></i> Personal Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-vehicle-management" className="nav-link">
                  <i className="ri-briefcase-line"></i> Vehicle Management
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-rental-reservations" className="nav-link">
                  <i className="ri-calendar-line"></i> Rental reservations
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-earnings-and-payments" className="nav-link">
                  <i className="ri-file-text-line"></i> Earnings & Payments
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-maintenance-and-documents" className="nav-link">
                  <i className="ri-settings-3-line"></i> Maintenance & Documents
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/profile/rentee-notifications" className="nav-link">
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
                <ReservationList />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeRentalReservations;
