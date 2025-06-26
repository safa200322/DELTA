import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Row, Col, Card, CardBody, Table, Button, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css"; // For sidebar and base styles
import "../styles/chauffeur-management.css"; // CSS for Chauffeur Management

// Mock Data for Reservation Management
const MOCK_RESERVATIONS = [
  { id: 1, username: "Umut Umutcuk", vehicle: "Toyota Camry", duration: "2025-06-26 10:00 - 2025-06-27 10:00" },
  { id: 2, username: "Ali Veli", vehicle: "Honda CR-V", duration: "2025-06-27 12:00 - 2025-06-28 12:00" },
  { id: 3, username: "Ayşe Yılmaz", vehicle: "Ford Focus", duration: "2025-06-28 14:00 - 2025-06-29 14:00" },
  { id: 4, username: "Mehmet Kaya", vehicle: "BMW X5", duration: "2025-06-29 09:00 - 2025-06-30 09:00" },
];

const ReservationManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);
  const location = useLocation();

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setReservations(
      MOCK_RESERVATIONS.filter(
        (reservation) =>
          reservation.username.toLowerCase().includes(query) ||
          reservation.vehicle.toLowerCase().includes(query) ||
          reservation.duration.toLowerCase().includes(query)
      )
    );
  };

  const handleAddReservation = () => {
    alert("Add New Reservation functionality to be implemented");
  };

  const handleExport = () => {
    alert("Export functionality to be implemented");
  };

  const handleCancelReservation = (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      setReservations(reservations.filter((res) => res.id !== id));
      alert(`Reservation for ${reservations.find((res) => res.id === id).username} has been cancelled.`);
    }
  };

  // Statistical data
  const stats = [
    { label: "Total Reservations", value: 120 },
    { label: "Active", value: 45 },
    { label: "Completed", value: 70 },
    { label: "Cancelled", value: 5 },
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
          <NavLink
                                    to="/payment-admin"
                                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                                  >
                                    <span className="sidebar-icon">💰</span> {/* Payment Admin Icon */}
                                  </NavLink>
        <li className="nav-item">
                    <NavLink
                      to="/notifications-Dashboard"
                      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    >
                      <span className="sidebar-icon">🔔</span> {/* Notifications Icon */}
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
        <h4 className="mb-4 chauffeur-management-title">Reservation Management</h4>

        {/* Header with Buttons and Stats */}
        <Card className="dashboard-card mb-3">
          <CardBody className="p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                color="primary"
                onClick={handleAddReservation}
                className="me-2 add-chauffeur-btn"
              >
                Add New Reservation →
              </Button>
              <Input
                type="text"
                placeholder="Search by username, vehicle or duration..."
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

        {/* Reservation Table */}
        <Card className="dashboard-card h-100 table-card">
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 chauffeur-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Vehicle</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.username}</td>
                      <td>{reservation.vehicle}</td>
                      <td>{reservation.duration}</td>
                      <td>
                        <Button
                          color="danger"
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="btn-sm"
                        >
                          Cancel Reservation
                        </Button>
                      </td>
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

export default ReservationManagement;