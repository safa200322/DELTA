import React, { useState, useEffect } from "react";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css";
import "../styles/vehicle-management.css";

const VehicleManagement = () => {
  const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
  const [dropdownLocationOpen, setDropdownLocationOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [sortOption, setSortOption] = useState("Price (Low to High)");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [vehicleType, setVehicleType] = useState("Car");
  const [vehicleFormData, setVehicleFormData] = useState({});

  const toggleTypeDropdown = () => setDropdownTypeOpen((prev) => !prev);
  const toggleLocationDropdown = () => setDropdownLocationOpen((prev) => !prev);
  const toggleSortDropdown = () => setSortOpen((prev) => !prev);
  const toggleAddVehicleModal = () => setAddVehicleModal((prev) => !prev);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterAndSortVehicles();
  }, [vehicles, typeFilter, locationFilter, searchQuery, sortOption]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/vehicle-owner/vehicles', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const vehicleData = await response.json();
        setVehicles(vehicleData);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortVehicles = () => {
    let filtered = [...vehicles];

    // Filter by type
    if (typeFilter !== "All") {
      filtered = filtered.filter(
        (vehicle) => vehicle.Type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Filter by location
    if (locationFilter !== "All locations") {
      filtered = filtered.filter((vehicle) =>
        vehicle.Location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.VehicleName.toLowerCase().includes(query) ||
          vehicle.Location.toLowerCase().includes(query) ||
          vehicle.Type.toLowerCase().includes(query)
      );
    }

    // Sort vehicles
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.Price);
      const priceB = parseFloat(b.Price);
      return sortOption === "Price (Low to High)"
        ? priceA - priceB
        : priceB - priceA;
    });

    setFilteredVehicles(filtered);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
  };

  const handleLocationFilter = (location) => {
    setLocationFilter(location);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/vehicles/vehicleownerdeletion/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setVehicles(vehicles.filter(v => v.VehicleID !== vehicleId));
        alert('Vehicle deleted successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = `http://localhost:5000/api/vehicles/${vehicleType.toLowerCase()}s`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vehicleFormData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${vehicleType} added successfully!`);
        setAddVehicleModal(false);
        setVehicleFormData({});
        fetchVehicles(); // Refresh the vehicle list
      } else {
        const errorData = await response.json();
        alert(errorData.message || `Failed to add ${vehicleType}`);
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert(`Failed to add ${vehicleType}`);
    }
  };

  const handleFormChange = (field, value) => {
    setVehicleFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <Badge color="success">Available</Badge>;
      case 'Rented':
        return <Badge color="warning">Rented</Badge>;
      case 'Maintenance':
        return <Badge color="secondary">Maintenance</Badge>;
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

  // Get unique locations for filter
  const uniqueLocations = [...new Set(vehicles.map(v => v.Location))];

  // Calculate stats
  const stats = [
    { 
      label: "Total Vehicles", 
      value: vehicles.length, 
      icon: "🚗", 
      color: "#4e73df" 
    },
    { 
      label: "Available", 
      value: vehicles.filter(v => v.Status === 'Available').length, 
      icon: "✅", 
      color: "#34c38f" 
    },
    { 
      label: "Rented", 
      value: vehicles.filter(v => v.Status === 'Rented').length, 
      icon: "📅", 
      color: "#f1b44c" 
    },
    { 
      label: "Maintenance", 
      value: vehicles.filter(v => v.Status === 'Maintenance').length, 
      icon: "🛠️", 
      color: "#74788d" 
    },
  ];

  const renderVehicleForm = () => {
    switch (vehicleType) {
      case 'Car':
        return (
          <>
            <FormGroup>
              <Label for="brand">Brand</Label>
              <Input
                type="text"
                id="brand"
                value={vehicleFormData.Brand || ''}
                onChange={(e) => handleFormChange('Brand', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="model">Model</Label>
              <Input
                type="text"
                id="model"
                value={vehicleFormData.Model || ''}
                onChange={(e) => handleFormChange('Model', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="year">Year</Label>
              <Input
                type="number"
                id="year"
                value={vehicleFormData.Year || ''}
                onChange={(e) => handleFormChange('Year', parseInt(e.target.value))}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="fuelType">Fuel Type</Label>
              <Input
                type="select"
                id="fuelType"
                value={vehicleFormData.FuelType || ''}
                onChange={(e) => handleFormChange('FuelType', e.target.value)}
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="transmission">Transmission</Label>
              <Input
                type="select"
                id="transmission"
                value={vehicleFormData.Transmission || ''}
                onChange={(e) => handleFormChange('Transmission', e.target.value)}
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="seats">Number of Seats</Label>
              <Input
                type="number"
                id="seats"
                value={vehicleFormData.Seats || ''}
                onChange={(e) => handleFormChange('Seats', parseInt(e.target.value))}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="color">Color</Label>
              <Input
                type="text"
                id="color"
                value={vehicleFormData.Color || ''}
                onChange={(e) => handleFormChange('Color', e.target.value)}
              />
            </FormGroup>
          </>
        );
      case 'Boat':
        return (
          <>
            <FormGroup>
              <Label for="brand">Brand</Label>
              <Input
                type="text"
                id="brand"
                value={vehicleFormData.Brand || ''}
                onChange={(e) => handleFormChange('Brand', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="boatType">Boat Type</Label>
              <Input
                type="text"
                id="boatType"
                value={vehicleFormData.BoatType || ''}
                onChange={(e) => handleFormChange('BoatType', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="capacity">Capacity</Label>
              <Input
                type="number"
                id="capacity"
                value={vehicleFormData.Capacity || ''}
                onChange={(e) => handleFormChange('Capacity', parseInt(e.target.value))}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="engineType">Engine Type</Label>
              <Input
                type="select"
                id="engineType"
                value={vehicleFormData.EngineType || ''}
                onChange={(e) => handleFormChange('EngineType', e.target.value)}
                required
              >
                <option value="">Select Engine Type</option>
                <option value="Inboard">Inboard</option>
                <option value="Outboard">Outboard</option>
                <option value="Sail">Sail</option>
              </Input>
            </FormGroup>
          </>
        );
      case 'Bicycle':
        return (
          <>
            <FormGroup>
              <Label for="type">Bicycle Type</Label>
              <Input
                type="select"
                id="type"
                value={vehicleFormData.Type || ''}
                onChange={(e) => handleFormChange('Type', e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Road">Road</option>
                <option value="Mountain">Mountain</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="gears">Number of Gears</Label>
              <Input
                type="number"
                id="gears"
                value={vehicleFormData.Gears || ''}
                onChange={(e) => handleFormChange('Gears', parseInt(e.target.value))}
                required
              />
            </FormGroup>
          </>
        );
      case 'Motorcycle':
        return (
          <>
            <FormGroup>
              <Label for="brand">Brand</Label>
              <Input
                type="text"
                id="brand"
                value={vehicleFormData.Brand || ''}
                onChange={(e) => handleFormChange('Brand', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="engine">Engine (CC)</Label>
              <Input
                type="number"
                id="engine"
                value={vehicleFormData.Engine || ''}
                onChange={(e) => handleFormChange('Engine', parseInt(e.target.value))}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="year">Year</Label>
              <Input
                type="number"
                id="year"
                value={vehicleFormData.Year || ''}
                onChange={(e) => handleFormChange('Year', parseInt(e.target.value))}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="type">Motorcycle Type</Label>
              <Input
                type="select"
                id="type"
                value={vehicleFormData.Type || ''}
                onChange={(e) => handleFormChange('Type', e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Sport">Sport</option>
                <option value="Cruiser">Cruiser</option>
                <option value="Touring">Touring</option>
                <option value="Standard">Standard</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="color">Color</Label>
              <Input
                type="text"
                id="color"
                value={vehicleFormData.color || ''}
                onChange={(e) => handleFormChange('color', e.target.value)}
                required
              />
            </FormGroup>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading vehicles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h6>Error Loading Vehicles</h6>
        <p>{error}</p>
        <Button color="primary" onClick={fetchVehicles}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="vehicle-management-container">
      <div className="vehicle-management-header mb-4 d-flex justify-content-between align-items-center">
        <h4 className="vehicle-management-title">
          <span className="title-icon">🚗</span> My Vehicles
        </h4>
        <Button color="primary" onClick={toggleAddVehicleModal}>
          <i className="ri-add-line me-2"></i>Add New Vehicle
        </Button>
      </div>

      {/* Stats Section */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col xs={12} sm={6} md={3} key={index} className="mb-3">
            <Card className="stat-card">
              <CardBody className="text-center p-3">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: stat.color }}
                >
                  {stat.icon}
                </div>
                <h6 className="stat-label mt-2">{stat.label}</h6>
                <h4 className="stat-value">{stat.value}</h4>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters and Search Section */}
      <Card className="dashboard-card filters-card mb-4">
        <CardBody className="p-3 d-flex flex-wrap align-items-center gap-3">
          <div className="search-container">
            <Input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={handleSearch}
              className="vehicle-search-input"
            />
          </div>
          <div className="filter-group">
            <span className="filter-label">Filter by Type</span>
            <Dropdown isOpen={dropdownTypeOpen} toggle={toggleTypeDropdown}>
              <DropdownToggle className="custom-dropdown-toggle">
                {typeFilter}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleTypeFilter("All")}>
                  All
                </DropdownItem>
                <DropdownItem onClick={() => handleTypeFilter("Car")}>
                  Car
                </DropdownItem>
                <DropdownItem onClick={() => handleTypeFilter("Bicycle")}>
                  Bicycle
                </DropdownItem>
                <DropdownItem onClick={() => handleTypeFilter("Motorcycle")}>
                  Motorcycle
                </DropdownItem>
                <DropdownItem onClick={() => handleTypeFilter("boats")}>
                  Boat
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="filter-group">
            <span className="filter-label">Filter by Location</span>
            <Dropdown
              isOpen={dropdownLocationOpen}
              toggle={toggleLocationDropdown}
            >
              <DropdownToggle className="custom-dropdown-toggle">
                {locationFilter}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => handleLocationFilter("All locations")}
                >
                  All locations
                </DropdownItem>
                {uniqueLocations.map((location, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => handleLocationFilter(location)}
                  >
                    {location}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="filter-group ms-auto">
            <span className="filter-label">Sort by</span>
            <Dropdown isOpen={sortOpen} toggle={toggleSortDropdown}>
              <DropdownToggle className="custom-dropdown-toggle">
                {sortOption}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => handleSort("Price (Low to High)")}
                >
                  Price (Low to High)
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSort("Price (High to Low)")}
                >
                  Price (High to Low)
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      {/* Vehicles Table */}
      <Card className="dashboard-card">
        <CardBody className="p-0">
          {filteredVehicles.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">No vehicles found matching your criteria.</p>
              <Button color="primary" onClick={toggleAddVehicleModal}>
                Add Your First Vehicle
              </Button>
            </div>
          ) : (
            <Table responsive hover className="vehicles-table mb-0">
              <thead className="table-header">
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price/Day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.VehicleID}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            vehicle.vehiclepic 
                              ? vehicle.vehiclepic.startsWith('http') 
                                ? vehicle.vehiclepic 
                                : `http://localhost:5000${vehicle.vehiclepic}`
                              : "https://via.placeholder.com/50x40?text=No+Image"
                          }
                          alt={vehicle.VehicleName}
                          className="vehicle-thumbnail me-3"
                          style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50x40?text=No+Image";
                          }}
                        />
                        <div>
                          <strong>{vehicle.VehicleName}</strong>
                          {vehicle.Color && (
                            <div className="text-muted small">
                              Color: {vehicle.Color}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge color="info" pill>
                        {vehicle.Type}
                      </Badge>
                    </td>
                    <td>{vehicle.Location}</td>
                    <td className="text-success fw-bold">
                      ${vehicle.Price}/day
                    </td>
                    <td>{getStatusBadge(vehicle.Status)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          size="sm"
                          color="danger"
                          outline
                          onClick={() => handleDeleteVehicle(vehicle.VehicleID)}
                          className="me-2"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Add Vehicle Modal */}
      <Modal isOpen={addVehicleModal} toggle={toggleAddVehicleModal} size="lg">
        <Form onSubmit={handleAddVehicle}>
          <ModalHeader toggle={toggleAddVehicleModal}>
            Add New Vehicle
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="vehicleType">Vehicle Type</Label>
              <Input
                type="select"
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => {
                  setVehicleType(e.target.value);
                  setVehicleFormData({});
                }}
              >
                <option value="Car">Car</option>
                <option value="Boat">Boat</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Motorcycle">Motorcycle</option>
              </Input>
            </FormGroup>

            {renderVehicleForm()}

            <FormGroup>
              <Label for="location">Location</Label>
              <Input
                type="text"
                id="location"
                value={vehicleFormData.Location || ''}
                onChange={(e) => handleFormChange('Location', e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="vehiclepic">Vehicle Picture URL (Optional)</Label>
              <Input
                type="text"
                id="vehiclepic"
                value={vehicleFormData.vehiclepic || ''}
                onChange={(e) => handleFormChange('vehiclepic', e.target.value)}
                placeholder="Enter image URL"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleAddVehicleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Vehicle
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default VehicleManagement;
