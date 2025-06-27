import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col, Card, CardBody, Table, Button, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css"; // For sidebar and base styles
import "../styles/chauffeur-management.css"; // CSS for Chauffeur Management

// Mock Data for Payment Admin Dashboard
const MOCK_PAYMENTS = [
  { id: 1, username: "Umut Umutcuk", vehicle: "Toyota Camry", amount: "$120.50", status: "Paid", paymentDate: "2025-06-20" },
  { id: 2, username: "Ali Veli", vehicle: "Honda CR-V", amount: "$150.00", status: "Pending", paymentDate: "2025-06-25" },
  { id: 3, username: "Ayşe Yılmaz", vehicle: "Ford Focus", amount: "$90.75", status: "Paid", paymentDate: "2025-06-22" },
  { id: 4, username: "Mehmet Kaya", vehicle: "BMW X5", amount: "$200.25", status: "Overdue", paymentDate: "2025-06-15" },
];

const PaymentAdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setPayments(
      MOCK_PAYMENTS.filter(
        (payment) =>
          payment.username.toLowerCase().includes(query) ||
          payment.vehicle.toLowerCase().includes(query) ||
          payment.amount.toLowerCase().includes(query) ||
          payment.status.toLowerCase().includes(query) ||
          payment.paymentDate.toLowerCase().includes(query)
      )
    );
  };

  const handleAddPayment = () => {
    alert("Add New Payment functionality to be implemented");
  };

  const handleExport = () => {
    alert("Export functionality to be implemented");
  };

  // Statistical data
  const stats = [
    { label: "Total Payments", value: 250 },
    { label: "Pending", value: 30 },
    { label: "Paid", value: 200 },
    { label: "Overdue", value: 20 },
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
              <span className="sidebar-icon">👤</span> {/* Chauffeur Management Icon */}
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
        <h4 className="mb-4 chauffeur-management-title">Payment Admin Dashboard</h4>

        {/* Header with Buttons and Stats */}
        <Card className="dashboard-card mb-3">
          <CardBody className="p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                color="primary"
                onClick={handleAddPayment}
                className="me-2 add-chauffeur-btn"
              >
                Add New Payment →
              </Button>
              <Input
                type="text"
                placeholder="Search by username, vehicle, amount, status or date..."
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

        {/* Payment Table */}
        <Card className="dashboard-card h-100 table-card">
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 chauffeur-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Vehicle</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.username}</td>
                      <td>{payment.vehicle}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.status}</td>
                      <td>{payment.paymentDate}</td>
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

export default PaymentAdminDashboard;