import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const PaymentsWallet = () => {
  const paymentHistory = [
    {
      id: 1,
      amount: 180,
      recipient: "John Doe",
      vehicle: "Toyota Camry - Sedan",
      date: "June 18, 2025, 09:00 AM +03",
    },
    {
      id: 2,
      amount: 270,
      recipient: "Jane Smith",
      vehicle: "Honda CR-V - SUV",
      date: "June 15, 2025, 02:00 PM +03",
    },
    {
      id: 3,
      amount: 150,
      recipient: "Mike Johnson",
      vehicle: "Ford Focus - Compact",
      date: "June 10, 2025, 11:00 AM +03",
    },
  ];

  return (
    <div className="user-profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="sidebar-title">User Profile</h3>
        <Nav vertical className="sidebar-nav">
          <NavItem>
            <NavLink
              to="/profile/ProfileOverview"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-user-line"></i> Profile Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyRentals"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-briefcase-line"></i> My Rentals
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyPayments"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-calendar-line"></i> Payments & Wallet
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyReviews"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-file-text-line"></i> My Reviews
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/NotificationsProfile"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-settings-3-line"></i> Notifications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/AccountSettings"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-notification-3-fill"></i> Account Settings
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg="8">
              <div className="payment-section">
                <h3 className="section-title">Payments & Wallet</h3>
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="payment-card">
                    <div className="payment-details">
                      <p className="payment-info">
                        <strong>Amount Paid:</strong> ${payment.amount}
                      </p>
                      <p className="payment-info">
                        <strong>Paid To:</strong> {payment.recipient}
                      </p>
                      <p className="payment-info">
                        <strong>Vehicle:</strong> {payment.vehicle}
                      </p>
                      <p className="payment-info">
                        <strong>Date:</strong> {payment.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default PaymentsWallet;
