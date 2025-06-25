import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Badge,
  Input,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css"; // For sidebar and base styles
import "../styles/chauffeur-management.css"; // CSS for Chauffeur Management

// Mock Data for Chauffeur Management
const MOCK_CHAUFFEURS = [
  {
    id: 1,
    name: "Albert Webb",
    location: "New York",
    phone: "(555) 123-4567",
    status: "Approved",
  },
  {
    id: 2,
    name: "Esther Howard",
    location: "Los Angeles",
    phone: "(555) 987-6543",
    status: "Approved",
  },
  {
    id: 3,
    name: "Jacob Jones",
    location: "Chicago",
    phone: "(555) 555-0199",
    status: "Approved",
  },
  {
    id: 4,
    name: "Devon Lane",
    location: "Chicago",
    phone: "(555) 678-8901",
    status: "Approved",
  },
  {
    id: 5,
    name: "Marvin McKinney",
    location: "Miami",
    phone: "(555) 567-1234",
    status: "Approved",
  },
  {
    id: 6,
    name: "Kathryn Murphy",
    location: "Dallas",
    phone: "(555) 326-9128",
    status: "Approved",
  },
  {
    id: 7,
    name: "Cameron Williamson",
    location: "San Francisco",
    phone: "(555) 672-9987",
    status: "Approved",
  },
  {
    id: 8,
    name: "Theresa Webb",
    location: "Seattle",
    phone: "(555) 456-7890",
    status: "Approved",
  },
];

const ChauffeurManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chauffeurs, setChauffeurs] = useState(MOCK_CHAUFFEURS);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setChauffeurs(
      MOCK_CHAUFFEURS.filter(
        (chauffeur) =>
          chauffeur.name.toLowerCase().includes(query) ||
          chauffeur.location.toLowerCase().includes(query) ||
          chauffeur.phone.includes(query)
      )
    );
  };

  const handleAddChauffeur = () => {
    alert("Add New Chauffeur functionality to be implemented");
  };

  const handleExport = () => {
    alert("Export functionality to be implemented");
  };

  // Statistical data as per the image
  const stats = [
    { label: "Total Chauffeurs", value: 120 },
    { label: "Pending", value: 16 },
    { label: "Approved", value: 95 },
    { label: "Unavailable", value: 9 },
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
            <Link className="nav-link" to="/admin" end>
              <span className="sidebar-icon">📊</span> {/* Dashboard Icon */}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/vehicle-management">
              <span className="sidebar-icon">🚗</span>{" "}
              {/* Vehicle Management Icon */}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link active" to="/chauffeur-management">
              <span className="sidebar-icon">👤</span>{" "}
              {/* Chauffeur Management Icon */}
            </Link>
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
        <h4 className="mb-4 chauffeur-management-title">
          Chauffeur Management
        </h4>

        {/* Header with Buttons and Stats */}
        <Card className="dashboard-card mb-3">
          <CardBody className="p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                color="primary"
                onClick={handleAddChauffeur}
                className="me-2 add-chauffeur-btn"
              >
                Add New Chauffeur →
              </Button>
              <Input
                type="text"
                placeholder="Search by name, location or phone..."
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

        {/* Chauffeur Table */}
        <Card className="dashboard-card h-100 table-card">
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 chauffeur-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chauffeurs.map((chauffeur) => (
                    <tr key={chauffeur.id}>
                      <td>{chauffeur.name}</td>
                      <td>{chauffeur.location}</td>
                      <td>{chauffeur.phone}</td>
                      <td>
                        <Badge
                          color={
                            chauffeur.status === "Approved"
                              ? "success"
                              : chauffeur.status === "Pending"
                              ? "warning"
                              : "secondary"
                          }
                          className="status-badge"
                        >
                          {chauffeur.status}
                        </Badge>
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

export default ChauffeurManagement;
