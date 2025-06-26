import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Badge } from "reactstrap";
import "../../styles/user-profile.css";
import RenteeSidebar from "../../components/RenteeSidebar";

const ReservationList = ({ reservations, loading, error }) => {
  const getStatusBadge = (status) => {
    switch (status) {
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

  return (
    <div className="reservation-list">
      <h5 className="section-title mb-3 enhanced-contrast-title">
        <i className="ri-calendar-line me-2 text-primary"></i>
        Incoming Reservations
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
                <Card className="reservation-card">
                  <CardBody>
                    <h6 className="reservation-title">{reservation.FirstName ? `${reservation.FirstName} ${reservation.LastName}` : reservation.renterName}</h6>
                    <p className="text-muted mb-2">
                      {reservation.rating && <>Rating: {reservation.rating} <i className="ri-star-fill text-warning"></i></>}
                    </p>
                    <p className="mb-2">
                      Rental Period: {reservation.StartDate || reservation.startDate} to {reservation.EndDate || reservation.endDate}
                    </p>
                    <p className="mb-0">Status: {getStatusBadge(reservation.status || reservation.Status)}</p>
                  </CardBody>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

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
        // Try multiple token keys for compatibility
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
