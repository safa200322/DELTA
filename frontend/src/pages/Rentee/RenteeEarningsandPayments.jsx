import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem, Card, CardBody } from "reactstrap";
import "../../styles/user-profile.css";

// Sample earnings data (replace with actual data from API or state management)
const earnings = {
  total: 2840,
  payouts: [
    {
      id: 1,
      title: "Honda CR-V Rental",
      date: "2025-05-25",
      amount: 180,
    },
    {
      id: 2,
      title: "Toyota Camry Rental",
      date: "2025-05-18",
      amount: 270,
    },
    {
      id: 3,
      title: "Ford F-150 Rental",
      date: "2025-04-30",
      amount: 350,
    },
  ],
};

const EarningsAndPayments = () => {
  return (
    <div className="earnings-payments">
      <h5 className="section-title mb-3">
        <i className="ri-money-dollar-circle-line me-2 text-warning"></i>
        Earnings & Payments
      </h5>
      <Row>
        <Col lg="12">
          <Card className="earnings-summary-card mb-4">
            <CardBody>
              <h6 className="mb-3">Total Earnings</h6>
              <h3 className="text-success">
                ${earnings.total.toLocaleString()}
              </h3>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <Card className="payouts-history-card">
            <CardBody>
              <h6 className="mb-3">Payout History</h6>
              {earnings.payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="payout-item mb-3 border-top pt-2"
                >
                  <div className="d-flex justify-content-between">
                    <span>{payout.title}</span>
                    <span className="text-success fw-bold">
                      +${payout.amount}
                    </span>
                  </div>
                  <small className="text-muted">{payout.date}</small>
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const RenteeEarningsandPayment = () => {
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
                <EarningsAndPayments />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeEarningsandPayment;
