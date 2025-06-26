import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const MyRentals = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/reservations/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservations/cancel/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Reservation cancelled successfully!');
        fetchReservations(); // Refresh the list
      } else {
        alert('Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Error cancelling reservation');
    }
  };

  const handleNotAvailable = (id) => {
    alert(`Vehicle from reservation ${id} marked as NOT AVAILABLE!`);
    // Add logic to mark vehicle as not available here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'status-pending';
    if (now >= start && now <= end) return 'status-active';
    return 'status-completed';
  };

  const getStatusText = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'Upcoming';
    if (now >= start && now <= end) return 'Active';
    return 'Completed';
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="sidebar">
          <h3 className="sidebar-title">User Profile</h3>
          {/* Sidebar nav items here */}
        </div>
        <div className="main-content">
          <Container fluid>
            <Row className="justify-content-center">
              <Col lg="8">
                <div className="loading-spinner">Loading your rentals...</div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="sidebar">
          <h3 className="sidebar-title">User Profile</h3>
          {/* Sidebar nav items here */}
        </div>
        <div className="main-content">
          <Container fluid>
            <Row className="justify-content-center">
              <Col lg="8">
                <div className="error-message">Error: {error}</div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

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
                {reservations.length === 0 ? (
                  <div className="no-rentals">
                    <p>You don't have any rentals yet.</p>
                  </div>
                ) : (
                  reservations.map((reservation) => (
                    <div key={reservation.ReservationID} className="rental-card">
                      <img
                        src={reservation.VehiclePic || "https://via.placeholder.com/150?text=Vehicle"}
                        alt={reservation.VehicleDetails}
                        className="rental-image"
                      />
                      <div className="rental-details">
                        <h4 className="rental-vehicle">
                          {reservation.VehicleDetails}
                        </h4>
                        <p className="rental-info">
                          <strong>Rental Period:</strong>{" "}
                          {formatDate(reservation.StartDate)} - {formatDate(reservation.EndDate)}
                        </p>
                        <p className="rental-info">
                          <strong>Pickup:</strong> {reservation.PickupLocation}
                        </p>
                        <p className="rental-info">
                          <strong>Return:</strong> {reservation.DropoffLocation}
                        </p>
                        <p className="rental-info">
                          <strong>Status:</strong>{" "}
                          <span className={getStatusClass(reservation.StartDate, reservation.EndDate)}>
                            {getStatusText(reservation.StartDate, reservation.EndDate)}
                          </span>
                        </p>
                        <p className="rental-info">
                          <strong>Owner Contact:</strong>{" "}
                          {reservation.OwnerName ? `${reservation.OwnerName}, ${reservation.OwnerPhone}` : 'Not available'}
                        </p>
                        <div className="rental-actions">
                          <button
                            className="btn-cancel"
                            onClick={() => handleCancel(reservation.ReservationID)}
                            disabled={getStatusText(reservation.StartDate, reservation.EndDate) === 'Completed'}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn-not-available"
                            onClick={() => handleNotAvailable(reservation.ReservationID)}
                          >
                            Mark NOT AVAILABLE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MyRentals;
