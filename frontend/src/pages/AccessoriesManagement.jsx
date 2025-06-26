import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col, Card, CardBody, Table, Button, Input, Form, FormGroup, Label } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css"; // For sidebar and base styles
import "../styles/chauffeur-management.css"; // CSS for Chauffeur Management

// Mock Data for Accessories
const MOCK_ACCESSORIES = [
  { id: 1, name: "GPS Navigator", description: "Portable GPS device", price: "$50.00", stock: 15 },
  { id: 2, name: "Child Seat", description: "Safety seat for kids", price: "$30.00", stock: 20 },
  { id: 3, name: "Roof Rack", description: "For extra storage", price: "$75.00", stock: 10 },
];

const AccessoriesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [accessories, setAccessories] = useState(MOCK_ACCESSORIES);
  const [newAccessory, setNewAccessory] = useState({ name: "", description: "", price: "", stock: "" });

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setAccessories(
      MOCK_ACCESSORIES.filter(
        (accessory) =>
          accessory.name.toLowerCase().includes(query) ||
          accessory.description.toLowerCase().includes(query) ||
          accessory.price.toLowerCase().includes(query) ||
          accessory.stock.toString().includes(query)
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccessory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAccessory = () => {
    if (newAccessory.name && newAccessory.description && newAccessory.price && newAccessory.stock) {
      const newId = Math.max(...MOCK_ACCESSORIES.map((a) => a.id), 0) + 1;
      setAccessories([...accessories, { ...newAccessory, id: newId, price: `$${newAccessory.price}`, stock: parseInt(newAccessory.stock) }]);
      setNewAccessory({ name: "", description: "", price: "", stock: "" });
      alert(`Accessory "${newAccessory.name}" created successfully!`);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleExport = () => {
    alert("Export functionality to be implemented");
  };

  // Statistical data
  const stats = [
    { label: "Total Accessories", value: 50 },
    { label: "In Stock", value: 45 },
    { label: "Out of Stock", value: 5 },
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
        <h4 className="mb-4 chauffeur-management-title">Accessories</h4>

        {/* Form for Adding Accessories */}
        <Card className="dashboard-card mb-3">
          <CardBody className="p-3">
            <Form>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={newAccessory.name}
                      onChange={handleInputChange}
                      placeholder="Enter accessory name"
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                      type="text"
                      name="description"
                      id="description"
                      value={newAccessory.description}
                      onChange={handleInputChange}
                      placeholder="Enter description"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label for="price">Price</Label>
                    <Input
                      type="number"
                      name="price"
                      id="price"
                      value={newAccessory.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label for="stock">Stock</Label>
                    <Input
                      type="number"
                      name="stock"
                      id="stock"
                      value={newAccessory.stock}
                      onChange={handleInputChange}
                      placeholder="Enter stock"
                    />
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    color="primary"
                    onClick={handleCreateAccessory}
                    className="w-100 add-chauffeur-btn"
                  >
                    Create Accessory →
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>

        {/* Header with Search and Export */}
        <Card className="dashboard-card mb-3">
          <CardBody className="p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Input
                type="text"
                placeholder="Search by name, description, price or stock..."
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

        {/* Accessories Table */}
        <Card className="dashboard-card h-100 table-card">
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 chauffeur-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {accessories.map((accessory) => (
                    <tr key={accessory.id}>
                      <td>{accessory.name}</td>
                      <td>{accessory.description}</td>
                      <td>{accessory.price}</td>
                      <td>{accessory.stock}</td>
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

export default AccessoriesManagement;