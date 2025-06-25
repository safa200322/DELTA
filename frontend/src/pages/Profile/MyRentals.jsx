import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const MyRentals = () => {
  const reservations = [
    {
      id: 1,
      vehiclePhoto: "https://i.pravatar.cc/150?img=5",
      vehicleDetails: "Toyota Camry - Sedan",
      rentalPeriod: "June 18, 2025 - June 20, 2025",
      pickupInfo: "Pickup: Delta Garage, 10:00 AM",
      returnInfo: "Return: Delta Garage, 10:00 AM",
      status: "completed",
      ownerContact: "John Doe, +90 500 111 2222",
    },
    {
      id: 2,
      vehiclePhoto: "https://i.pravatar.cc/150?img=6",
      vehicleDetails: "Honda CR-V - SUV",
      rentalPeriod: "June 21, 2025 - June 23, 2025",
      pickupInfo: "Pickup: City Center, 12:00 PM",
      returnInfo: "Return: City Center, 12:00 PM",
      status: "pending",
      ownerContact: "Jane Smith, +90 500 333 4444",
    },
    {
      id: 3,
      vehiclePhoto: "https://i.pravatar.cc/150?img=7",
      vehicleDetails: "Ford Focus - Compact",
      rentalPeriod: "June 15, 2025 - June 17, 2025",
      pickupInfo: "Pickup: Airport, 8:00 AM",
      returnInfo: "Return: Airport, 8:00 AM",
      status: "cancelled",
      ownerContact: "Mike Johnson, +90 500 555 6666",
    },
  ];

  const handleCancel = (id) => {
    alert(`Reservation ${id} cancelled!`);
    // Add cancellation logic here
  };

  const handleNotAvailable = (id) => {
    alert(`Vehicle from reservation ${id} marked as NOT AVAILABLE!`);
    // Add logic to mark vehicle as not available here
  };

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
              <div className="rental-section">
                <h3 className="section-title">My Rentals</h3>
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="rental-card">
                    <img
                      src={reservation.vehiclePhoto}
                      alt={reservation.vehicleDetails}
                      className="rental-image"
                    />
                    <div className="rental-details">
                      <h4 className="rental-vehicle">
                        {reservation.vehicleDetails}
                      </h4>
                      <p className="rental-info">
                        <strong>Rental Period:</strong>{" "}
                        {reservation.rentalPeriod}
                      </p>
                      <p className="rental-info">
                        <strong>Pickup:</strong> {reservation.pickupInfo}
                      </p>
                      <p className="rental-info">
                        <strong>Return:</strong> {reservation.returnInfo}
                      </p>
                      <p className="rental-info">
                        <strong>Status:</strong>{" "}
                        {reservation.status === "completed" ? (
                          <span className="status-completed">
                            {reservation.status}
                          </span>
                        ) : reservation.status === "pending" ? (
                          <span className="status-pending">
                            {reservation.status}
                          </span>
                        ) : (
                          <span className="status-cancelled">
                            {reservation.status}
                          </span>
                        )}
                      </p>
                      <p className="rental-info">
                        <strong>Owner Contact:</strong>{" "}
                        {reservation.ownerContact}
                      </p>
                      <div className="rental-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(reservation.id)}
                          disabled={
                            reservation.status === "cancelled" ||
                            reservation.status === "completed"
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-not-available"
                          onClick={() => handleNotAvailable(reservation.id)}
                        >
                          Mark NOT AVAILABLE
                        </button>
                      </div>
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

export default MyRentals;
