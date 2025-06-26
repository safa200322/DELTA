import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/user-profile.css";
import RenteeSidebar from "../../components/RenteeSidebar";

const RenteeNotifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        // Try multiple token keys for compatibility
        const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
        if (!token) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }
        const response = await fetch('http://localhost:5000/api/notifications/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.statusText}`);
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Reservation":
        return <i className="ri-calendar-line text-primary fs-4"></i>;
      case "Payment":
        return <i className="ri-money-dollar-circle-line text-success fs-4"></i>;
      case "Review":
        return <i className="ri-star-line text-warning fs-4"></i>;
      case "System":
        return <i className="ri-information-line text-info fs-4"></i>;
      default:
        return <i className="ri-notification-3-line text-secondary fs-4"></i>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <section style={{ marginTop: "10px" }}>
      <Container fluid>
        <Row>
          <RenteeSidebar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <Col xs="12" md="9" lg="10" className="content-area">
            <div className="notifications-section">
              <h4 className="section-title mb-4 enhanced-contrast-title">
                <i className="ri-notification-3-line me-2 text-primary"></i>
                Notifications
              </h4>
              {loading ? (
                <div className="loading-spinner">Loading notifications...</div>
              ) : error ? (
                <div className="error-message text-danger">{error}</div>
              ) : notifications.length === 0 ? (
                <div className="text-muted">No notifications found.</div>
              ) : (
                <ul className="list-unstyled notifications-list">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`notification-item notification-${notif.type || 'default'} mb-3 p-3 border rounded shadow-sm d-flex justify-content-between align-items-center`}
                    >
                      <div>
                        <div className="fw-bold">{notif.title}</div>
                        <div className="mb-1">{notif.message}</div>
                        <small className="text-muted">{formatDate(notif.createdAt)}</small>
                      </div>
                      {getNotificationIcon(notif.type)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeNotifications;
