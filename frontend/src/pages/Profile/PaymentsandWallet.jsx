import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import "../../styles/user-profile.css";

const PaymentsWallet = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data);

        // Calculate total spent
        const total = data.reduce((sum, payment) => sum + (payment.TotalPrice || payment.Amount || 0), 0);
        setTotalSpent(total);
      } else {
        setError('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error loading payments');
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'status-paid';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-unknown';
    }
  };

  if (loading) {
    return (
      <div className="user-profile-page">
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
        <div className="main-content">
          <Container fluid>
            <Row className="justify-content-center">
              <Col lg="8">
                <div className="payment-section">
                  <h3 className="section-title">Payments & Wallet</h3>
                  <p>Loading your payment history...</p>
                </div>
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
        <div className="main-content">
          <Container fluid>
            <Row className="justify-content-center">
              <Col lg="8">
                <div className="payment-section">
                  <h3 className="section-title">Payments & Wallet</h3>
                  <p style={{ color: 'red' }}>{error}</p>
                </div>
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
              <div className="payment-section">
                <h3 className="section-title">Payments & Wallet</h3>

                {/* Wallet Summary */}
                <div className="wallet-summary">
                  <div className="summary-card">
                    <h4>Total Spent</h4>
                    <p className="total-amount">{formatCurrency(totalSpent)}</p>
                  </div>
                  <div className="summary-card">
                    <h4>Total Transactions</h4>
                    <p className="total-count">{payments.length}</p>
                  </div>
                </div>

                {/* Payment History */}
                <h4 className="subsection-title">Payment History</h4>
                {payments.length === 0 ? (
                  <p>No payment history found.</p>
                ) : (
                  payments.map((payment) => (
                    <div key={payment.PaymentID} className="payment-card">
                      {payment.VehiclePic && (
                        <img
                          src={payment.VehiclePic}
                          alt={payment.VehicleDetails}
                          className="payment-vehicle-image"
                        />
                      )}
                      <div className="payment-details">
                        <div className="payment-header">
                          <h5 className="payment-vehicle">
                            {payment.VehicleDetails || `${payment.VehicleType} Vehicle`}
                          </h5>
                          <span className={`payment-status ${getStatusClass(payment.Status)}`}>
                            {payment.Status}
                          </span>
                        </div>

                        <div className="payment-info-grid">
                          <div className="payment-info-item">
                            <strong>Amount Paid:</strong> {formatCurrency(payment.TotalPrice || payment.Amount)}
                          </div>

                          {payment.OwnerName && (
                            <div className="payment-info-item">
                              <strong>Paid To:</strong> {payment.OwnerName}
                              {payment.OwnerPhone && ` (${payment.OwnerPhone})`}
                            </div>
                          )}

                          <div className="payment-info-item">
                            <strong>Rental Period:</strong> {formatDate(payment.StartDate)} - {formatDate(payment.EndDate)}
                          </div>

                          <div className="payment-info-item">
                            <strong>Pickup:</strong> {payment.PickupLocation}
                          </div>

                          <div className="payment-info-item">
                            <strong>Dropoff:</strong> {payment.DropoffLocation}
                          </div>

                          <div className="payment-info-item">
                            <strong>Payment Method:</strong> {payment.PaymentMethod || 'Card'}
                          </div>

                          {payment.ChauffeurName && (
                            <div className="payment-info-item">
                              <strong>Chauffeur:</strong> {payment.ChauffeurName}
                              {payment.ChauffeurAmount && (
                                <span className="chauffeur-fee">
                                  (Fee: {formatCurrency(payment.ChauffeurAmount)})
                                </span>
                              )}
                            </div>
                          )}

                          {payment.CardNumber && (
                            <div className="payment-info-item">
                              <strong>Card:</strong> **** **** **** {payment.CardNumber.slice(-4)}
                            </div>
                          )}
                        </div>

                        {/* Cost Breakdown */}
                        {payment.TotalPrice && (
                          <div className="cost-breakdown">
                            <h6>Cost Breakdown:</h6>
                            <div className="breakdown-item">
                              <span>Subtotal:</span>
                              <span>{formatCurrency((payment.TotalPrice || 0) - (payment.ChauffeurAmount || 0))}</span>
                            </div>
                            {payment.ChauffeurAmount > 0 && (
                              <div className="breakdown-item">
                                <span>Chauffeur Fee:</span>
                                <span>{formatCurrency(payment.ChauffeurAmount)}</span>
                              </div>
                            )}
                            <div className="breakdown-item total">
                              <span><strong>Total:</strong></span>
                              <span><strong>{formatCurrency(payment.TotalPrice)}</strong></span>
                            </div>
                          </div>
                        )}
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

export default PaymentsWallet;
