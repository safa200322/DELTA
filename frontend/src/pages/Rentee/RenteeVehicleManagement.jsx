import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Spinner,
  Alert,
} from "reactstrap";
import "../../styles/user-profile.css";
import RenteeSidebar from "../../components/RenteeSidebar";
import VehicleOwnerProfileEdit from "../../components/VehicleOwnerProfileEdit";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [rentalHistoryModal, setRentalHistoryModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check user authentication and role
  const checkAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      return { isAuthenticated: false, message: 'Not authenticated. Please log in as a vehicle owner.' };
    }

    if (userRole && userRole !== 'vehicle_owner') {
      return { isAuthenticated: false, message: 'Access denied. Please log in as a vehicle owner.' };
    }

    return { isAuthenticated: true, token };
  };

  // Fetch user's vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const auth = checkAuth();
      if (!auth.isAuthenticated) {
        throw new Error(auth.message);
      }

      const response = await fetch('http://localhost:5000/api/vehicle-owner/vehicles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      setVehicles(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceRecords = async (vehicleId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
      const response = await fetch(`http://localhost:5000/api/maintenance/vehicle/${vehicleId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch maintenance records');
      }

      const data = await response.json();
      setMaintenanceRecords(data);
    } catch (err) {
      console.error('Error fetching maintenance records:', err);
      setMaintenanceRecords([]);
    }
  };

  const fetchRentalHistory = async (vehicleId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
      const response = await fetch('http://localhost:5000/api/reservations/my-vehicles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rental history');
      }

      const data = await response.json();
      // Filter for the specific vehicle
      const vehicleRentals = data.filter(rental => rental.VehicleID === vehicleId);
      setRentalHistory(vehicleRentals);
    } catch (err) {
      console.error('Error fetching rental history:', err);
      setRentalHistory([]);
    }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
      const response = await fetch(`http://localhost:5000/api/vehicles/vehicleownerdeletion/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove vehicle');
      }

      // Remove vehicle from local state
      setVehicles(vehicles.filter(v => v.VehicleID !== vehicleId));
      alert('Vehicle removed successfully');
    } catch (err) {
      console.error('Error removing vehicle:', err);
      alert('Failed to remove vehicle: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to deactivate this vehicle?')) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
      const response = await fetch(`http://localhost:5000/api/vehicles/deactivate/${vehicleId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate vehicle');
      }

      // Update vehicle status in local state
      setVehicles(vehicles.map(v =>
        v.VehicleID === vehicleId
          ? { ...v, Status: 'Maintenance' }
          : v
      ));
      alert('Vehicle deactivated successfully');
    } catch (err) {
      console.error('Error deactivating vehicle:', err);
      alert('Failed to deactivate vehicle: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openMaintenanceModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    fetchMaintenanceRecords(vehicle.VehicleID);
    setMaintenanceModal(true);
  };

  const openRentalHistoryModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    fetchRentalHistory(vehicle.VehicleID);
    setRentalHistoryModal(true);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return <Badge color="success">Available</Badge>;
      case "rented":
        return <Badge color="warning">Rented</Badge>;
      case "maintenance":
        return <Badge color="danger">Maintenance</Badge>;
      case "pending":
        return <Badge color="info">Pending Approval</Badge>;
      case "approved":
        return <Badge color="success">Approved</Badge>;
      case "rejected":
        return <Badge color="danger">Rejected</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  const getVehicleImage = (vehicle) => {
    // Handle both vehiclepic and VehiclePic field names
    const imagePath = vehicle.VehiclePic || vehicle.vehiclepic;
    if (imagePath) {
      // If it's a full URL, use it directly
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      // Otherwise, construct the backend URL
      return `http://localhost:5000/${imagePath}`;
    }
    // Fallback image
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  const getVehicleBrandModel = (vehicle) => {
    // Handle both separate Brand/Model fields and combined VehicleName
    if (vehicle.Brand && vehicle.Model) {
      return { brand: vehicle.Brand, model: vehicle.Model };
    } else if (vehicle.VehicleName) {
      // Try to split VehicleName into brand and model
      const parts = vehicle.VehicleName.split(' ');
      if (parts.length >= 2) {
        return { brand: parts[0], model: parts.slice(1).join(' ') };
      }
      return { brand: vehicle.VehicleName, model: '' };
    }
    return { brand: 'Unknown', model: 'Vehicle' };
  };

  if (loading) {
    return (
      <div className="text-center p-4" style={{ color: '#1976d2' }}>
        <Spinner color="primary" />
        <p className="mt-2" style={{ color: '#424242', fontSize: '16px', fontWeight: '500' }}>Loading your vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger" style={{
        backgroundColor: '#ffebee',
        border: '1px solid #d32f2f',
        color: '#b71c1c'
      }}>
        <h4 style={{ color: '#b71c1c', fontWeight: '600' }}>Error</h4>
        <p style={{ color: '#c62828', fontSize: '16px' }}>{error}</p>
        <div className="d-flex gap-2">
          <Button color="primary" onClick={fetchVehicles} style={{
            backgroundColor: '#1976d2',
            borderColor: '#1976d2',
            fontWeight: '500'
          }}>
            Try Again
          </Button>
          {error.includes('authenticated') && (
            <Button color="secondary" tag="a" href="/vehicle-owner-login" style={{
              backgroundColor: '#424242',
              borderColor: '#424242',
              color: '#ffffff',
              fontWeight: '500'
            }}>
              Login as Vehicle Owner
            </Button>
          )}
        </div>
      </Alert>
    );
  }

  return (
    <div className="vehicle-management">
      <h5 className="section-title mb-3" style={{ color: '#1976d2', fontWeight: '600' }}>
        <i className="ri-car-line me-2 text-primary"></i>
        My Vehicles ({vehicles.length})
      </h5>

      {vehicles.length === 0 ? (
        <Alert color="info" style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #1976d2',
          color: '#0d47a1'
        }}>
          <h4 style={{ color: '#0d47a1', fontWeight: '600' }}>No Vehicles Found</h4>
          <p style={{ color: '#1565c0', fontSize: '16px' }}>You haven't added any vehicles yet. Start by adding your first vehicle to get bookings!</p>
          <Button color="primary" onClick={() => setAddVehicleModal(true)} style={{
            backgroundColor: '#1976d2',
            borderColor: '#1976d2',
            fontWeight: '500'
          }}>
            Add Your First Vehicle
          </Button>
          <VehicleOwnerProfileEdit
            isOpen={addVehicleModal}
            toggle={() => setAddVehicleModal(false)}
            currentUser={currentUser}
            onProfileUpdate={() => { setAddVehicleModal(false); fetchVehicles(); }}
          />
        </Alert>
      ) : (
        <Row>
          {vehicles.map((vehicle) => {
            const { brand, model } = getVehicleBrandModel(vehicle);
            return (
              <Col md="12" lg="6" xl="4" key={vehicle.VehicleID} className="mb-4">
                <Card className="vehicle-card h-100" style={{
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  minWidth: '350px'
                }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={getVehicleImage(vehicle)}
                      alt={`${brand} ${model}`}
                      className="vehicle-thumbnail"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        backgroundColor: "#f8f9fa",
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/500x250?text=No+Image&bg=f8f9fa&color=6c757d";
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      zIndex: 2
                    }}>
                      {getStatusBadge(vehicle.Status)}
                    </div>
                  </div>
                  <CardBody style={{ padding: '25px' }}>
                    <div className="mb-4">
                      <h4 className="vehicle-title mb-3" style={{
                        color: '#1976d2',
                        fontWeight: '600',
                        fontSize: '1.3rem',
                        marginBottom: '12px'
                      }}>
                        {brand} {model}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <p className="mb-0" style={{
                          color: '#424242',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <i className="ri-car-line me-3" style={{ color: '#1976d2', fontSize: '18px' }}></i>
                          <strong>Type:</strong> <span className="ms-2">{vehicle.Type}</span>
                        </p>
                        {vehicle.Color && (
                          <p className="mb-0" style={{
                            color: '#424242',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <i className="ri-palette-line me-3" style={{ color: '#1976d2', fontSize: '18px' }}></i>
                            <strong>Color:</strong> <span className="ms-2">{vehicle.Color}</span>
                          </p>
                        )}
                        {vehicle.Price && (
                          <p className="mb-0" style={{
                            color: '#2e7d32',
                            fontSize: '18px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <i className="ri-money-dollar-circle-line me-3" style={{ color: '#2e7d32', fontSize: '20px' }}></i>
                            ${vehicle.Price}/day
                          </p>
                        )}
                        {vehicle.Location && (
                          <p className="mb-0" style={{
                            color: '#424242',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <i className="ri-map-pin-line me-3" style={{ color: '#1976d2', fontSize: '18px' }}></i>
                            <strong>Location:</strong> <span className="ms-2">{vehicle.Location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="vehicle-actions d-flex gap-3 flex-wrap">
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => openMaintenanceModal(vehicle)}
                        disabled={actionLoading}
                        style={{
                          borderRadius: '8px',
                          fontWeight: '500',
                          padding: '10px 16px',
                          fontSize: '14px',
                          minWidth: '120px'
                        }}
                      >
                        <i className="ri-tools-line me-2"></i>
                        Maintenance
                      </Button>
                      <Button
                        color="info"
                        size="sm"
                        onClick={() => openRentalHistoryModal(vehicle)}
                        disabled={actionLoading}
                        style={{
                          borderRadius: '8px',
                          fontWeight: '500',
                          padding: '10px 16px',
                          fontSize: '14px',
                          minWidth: '100px'
                        }}
                      >
                        <i className="ri-history-line me-2"></i>
                        History
                      </Button>
                      <Dropdown
                        isOpen={dropdownOpen[vehicle.VehicleID] || false}
                        toggle={() => toggleDropdown(vehicle.VehicleID)}
                      >
                        <DropdownToggle
                          caret
                          color="danger"
                          size="sm"
                          disabled={actionLoading}
                          style={{
                            borderRadius: '8px',
                            fontWeight: '500',
                            padding: '10px 16px',
                            fontSize: '14px',
                            minWidth: '80px'
                          }}
                        >
                          <i className="ri-more-fill me-1"></i>
                          More
                        </DropdownToggle>
                        <DropdownMenu style={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                          <DropdownItem
                            onClick={() => handleRemoveVehicle(vehicle.VehicleID)}
                            style={{ padding: '12px 20px' }}
                          >
                            <i className="ri-delete-bin-line me-2" style={{ color: '#d32f2f' }}></i>
                            Remove Vehicle
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDeactivateVehicle(vehicle.VehicleID)}
                            style={{ padding: '12px 20px' }}
                          >
                            <i className="ri-pause-circle-line me-2" style={{ color: '#f57c00' }}></i>
                            Deactivate Vehicle
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Maintenance Modal */}
      <Modal isOpen={maintenanceModal} toggle={() => setMaintenanceModal(false)} size="lg">
        <ModalHeader toggle={() => setMaintenanceModal(false)}>
          Maintenance Records - {selectedVehicle ? (() => {
            const { brand, model } = getVehicleBrandModel(selectedVehicle);
            return `${brand} ${model}`;
          })() : 'Vehicle'}
        </ModalHeader>
        <ModalBody>
          {maintenanceRecords.length === 0 ? (
            <p>No maintenance records found for this vehicle.</p>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.map((record) => (
                  <tr key={record.MaintenanceID}>
                    <td>{new Date(record.MaintenanceDate).toLocaleDateString()}</td>
                    <td>{record.MaintenanceType}</td>
                    <td>{record.Description}</td>
                    <td>${record.Cost || 'N/A'}</td>
                    <td>
                      <Badge color={record.Status === 'Completed' ? 'success' : 'warning'}>
                        {record.Status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setMaintenanceModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Rental History Modal */}
      <Modal isOpen={rentalHistoryModal} toggle={() => setRentalHistoryModal(false)} size="lg">
        <ModalHeader toggle={() => setRentalHistoryModal(false)}>
          Rental History - {selectedVehicle ? (() => {
            const { brand, model } = getVehicleBrandModel(selectedVehicle);
            return `${brand} ${model}`;
          })() : 'Vehicle'}
        </ModalHeader>
        <ModalBody>
          {rentalHistory.length === 0 ? (
            <p>No rental history found for this vehicle.</p>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Renter</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Pickup Location</th>
                  <th>Dropoff Location</th>
                </tr>
              </thead>
              <tbody>
                {rentalHistory.map((rental) => (
                  <tr key={rental.ReservationID}>
                    <td>{rental.FirstName} {rental.LastName}</td>
                    <td>{new Date(rental.StartDate).toLocaleDateString()}</td>
                    <td>{new Date(rental.EndDate).toLocaleDateString()}</td>
                    <td>{rental.PickupLocation}</td>
                    <td>{rental.DropoffLocation}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setRentalHistoryModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const RenteeVehicleManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <section style={{ marginTop: "10px" }}>
      <Container fluid>
        <Row>
          <RenteeSidebar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <Col xs="12" md="9" lg="10" className="content-area">
            <Row className="mt-4">
              <Col lg="12">
                <div className="placeholder-text mb-4">
                  <h3 style={{ color: '#1976d2', fontWeight: '600' }}>Vehicle Management</h3>
                  {/* <p>
                    This section will display user profile and payment details
                    in the future.
                  </p> */}
                </div>
                <VehicleManagement />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeVehicleManagement;
