import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col, Card, CardBody, Table, Button, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css"; // For sidebar and base styles
import "../styles/chauffeur-management.css"; // CSS for Chauffeur Management

// Mock Data for Notifications
const MOCK_NOTIFICATIONS = [
  { id: 1, message: "Reservation confirmed for Umut Umutcuk", timestamp: "2025-06-26 10:00 AM", status: "Unread" },
  { id: 2, message: "Payment pending for Ali Veli", timestamp: "2025-06-26 11:30 AM", status: "Read" },
  { id: 3, message: "Vehicle maintenance scheduled for Ayşe Yılmaz", timestamp: "2025-06-26 12:00 PM", status: "Unread" },
  { id: 4, message: "Payment overdue for Mehmet Kaya", timestamp: "2025-06-25 09:00 PM", status: "Read" },
];

const NotificationsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setNotifications(
      MOCK_NOTIFICATIONS.filter(
        (notification) =>
          notification.message.toLowerCase().includes(query) ||
          notification.timestamp.toLowerCase().includes(query) ||
          notification.status.toLowerCase().includes(query)
      )
    );
  };

  const handleMarkAllAsRead = () => {
    alert("Mark All as Read functionality to be implemented");
  };

  const handleExport = () => {
    alert("Export functionality to be implemented");
  };

  // Statistical data
  const stats = [
    { label: "Total Notifications", value: 50 },
    { label: "Unread", value: 15 },
    { label: "Read", value: 35 },
  ];

  return (
    <div className="dashboard-wrapper d-flex">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header text-center p-3">
          <img
            src="https://placehold.co/40x40/667fff/ffffff.png?text=L"
            alt="Logo"
            className="mb-2"
          />
        </div>
        <ul className="nav flex-column sidebar-nav">
          <li className="nav-item">
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              end
            >
              <span className="sidebar-icon">📊</span> {/* Dashboard Icon */}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/vehicle-management"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span className="sidebar-icon">🚗</span> {/* Vehicle Management Icon */}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/chauffeur-management"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span className="sidebar-icon">👤</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/reservation-management"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span className="sidebar-icon">📅</span> {/* Reservation Management Icon */}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/payment-admin"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span className="sidebar-icon">💰</span> {/* Payment Admin Icon */}
            </NavLink>
          </li>
           <li className="nav-item">
                                        <NavLink
                                          to="/accessories-management"
                                          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                                        >
                                          <span className="sidebar-icon">🛠️</span> {/* Accessories Icon */}
                                        </NavLink>
                                      </li>
          <li className="nav-item">
            <NavLink
              to="/notifications-Dashboard"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span className="sidebar-icon">🔔</span> {/* Notifications Icon */}
            </NavLink>
          </li>
        </ul>
        <div className="sidebar-footer text-center p-3">
          <img
            src="https://placehold.co/40x40/cccccc/ffffff.png?text=JD"
            alt="Profile"
            className="rounded-circle mb-2"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main-content flex-grow-1 p-3">
        <h4 className="mb-4 chauffeur-management-title">Notifications</h4>

        {/* Header with Buttons and Stats */}
        <Card className="dashboard-card mb-3">
          <CardBody className="p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                color="primary"
                onClick={handleMarkAllAsRead}
                className="me-2 add-chauffeur-btn"
              >
                Mark All as Read →
              </Button>
              <Input
                type="text"
                placeholder="Search by message, timestamp or status..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <div>
              <Button
                color="secondary"
                onClick={handleExport}
                className="export-btn"
              >
                <span>↓</span> Export
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Stats Section */}
        <Card className="dashboard-card mb-3 stats-card">
          <CardBody className="p-2 d-flex justify-content-around">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="stats-value">{stat.value}</div>
                <div className="stats-label">{stat.label}</div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Notifications Table */}
        <Card className="dashboard-card h-100 table-card">
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 chauffeur-table">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td>{notification.message}</td>
                      <td>{notification.timestamp}</td>
                      <td>{notification.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsDashboard;