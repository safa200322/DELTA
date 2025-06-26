import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Badge } from "reactstrap";
import "../../styles/user-profile.css";
import RenteeSidebar from "../../components/RenteeSidebar";

const getVehicleImage = (reservation) => {
  const imagePath = reservation.VehiclePic || reservation.vehiclepic || reservation.imgUrl;
  if (imagePath) {
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000/${imagePath}`;
  }
  return "https://via.placeholder.com/300x200?text=No+Image";
};

const getVehicleBrandModel = (reservation) => {
  if (reservation.Brand && reservation.Model) {
    return `${reservation.Brand} ${reservation.Model}`;
  }
  if (reservation.VehicleName) {
    return reservation.VehicleName;
  }
  if (reservation.Type && reservation.model) {
    return `${reservation.Type} ${reservation.model}`;
  }
  return "Vehicle";
};

const getVehicleType = (reservation) => reservation.Type || reservation.vehicleType || "";
const getVehicleColor = (reservation) => reservation.Color || reservation.color || "-";
const getVehicleYear = (reservation) => reservation.Year || reservation.year || "-";
const getVehiclePrice = (reservation) => reservation.Price || reservation.price || "-";

const getStatusBadge = (status) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return <Badge color="warning">Pending</Badge>;
    case "accepted":
      return <Badge color="success">Accepted</Badge>;
    case "declined":
      return <Badge color="danger">Declined</Badge>;
    case "completed":
      return <Badge color="primary">Completed</Badge>;
    default:
      return <Badge color="secondary">Unknown</Badge>;
  }
};

const ReservationList = ({ reservations, loading, error }) => (
  <div className="reservation-list">
    <h5 className="section-title mb-3 enhanced-contrast-title">
      <i className="ri-calendar-line me-2 text-primary"></i>
      My Rental Reservations
    </h5>
    {loading ? (
      <div className="loading-spinner">Loading reservations...</div>
    ) : error ? (
      <div className="error-message">{error}</div>
    ) : (
      <Row>
        {reservations.length === 0 ? (
          <div className="text-muted">No reservations found.</div>
        ) : (
          reservations.map((reservation) => (
            <Col md="6" lg="4" key={reservation.ReservationID || reservation.id} className="mb-4">
              <Card className="reservation-card shadow-sm h-100">
                <div style={{ position: "relative" }}>
                  <img
                    src={getVehicleImage(reservation)}
                    alt={getVehicleBrandModel(reservation)}
                    className="vehicle-thumbnail"
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }}
                    onError={e => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                  />
                  <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
                    {getStatusBadge(reservation.status || reservation.Status)}
                  </div>
                </div>
                <CardBody style={{ padding: "1.5rem" }}>
                  <h6 className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>{getVehicleBrandModel(reservation)}</h6>
                  <div className="d-flex flex-wrap gap-2 mb-2 text-muted" style={{ fontSize: "0.95rem" }}>
                    <span><i className="ri-car-line me-1"></i>Type: {getVehicleType(reservation)}</span>
                    <span><i className="ri-palette-line me-1"></i>Color: {getVehicleColor(reservation)}</span>
                    <span><i className="ri-calendar-2-line me-1"></i>Year: {getVehicleYear(reservation)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="fw-semibold text-success" style={{ fontSize: "1.1rem" }}>
                      <i className="ri-money-dollar-circle-line me-1"></i>
                      {getVehiclePrice(reservation)}/day
                    </span>
                  </div>
                  <div className="mb-2">
                    <i className="ri-time-line me-1 text-primary"></i>
                    <span className="fw-semibold">Rental Period:</span> <br />
                    <span>{reservation.StartDate || reservation.startDate} &rarr; {reservation.EndDate || reservation.endDate}</span>
                  </div>
                  <div className="mb-2">
                    <i className="ri-map-pin-line me-1 text-danger"></i>
                    <span className="fw-semibold">Pickup:</span> {reservation.PickupLocation || reservation.pickupLocation || "-"}
                  </div>
                  <div className="mb-2">
                    <i className="ri-map-pin-user-line me-1 text-info"></i>
                    <span className="fw-semibold">Dropoff:</span> {reservation.DropoffLocation || reservation.dropoffLocation || "-"}
                  </div>
                  {reservation.TotalPrice && (
                    <div className="mb-2">
                      <i className="ri-currency-line me-1 text-warning"></i>
                      <span className="fw-semibold">Total Paid:</span> ${reservation.TotalPrice}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </Row>
    )}
  </div>
);

const RenteeRentalReservations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
        if (!token) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }
        const response = await fetch('http://localhost:5000/api/reservations/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch reservations: ${response.statusText}`);
        }
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

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
                <ReservationList reservations={reservations} loading={loading} error={error} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeRentalReservations;
