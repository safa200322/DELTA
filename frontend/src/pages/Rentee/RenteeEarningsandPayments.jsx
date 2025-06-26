import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import "../../styles/user-profile.css";
import RenteeSidebar from "../../components/RenteeSidebar";

const EarningsAndPayments = ({ earnings, loading, error }) => {
  if (loading) {
    return (
      <div className="earnings-payments">
        <h5 className="section-title mb-3 enhanced-contrast-title">
          <i className="ri-money-dollar-circle-line me-2 text-warning"></i>
          Earnings & Payments
        </h5>
        <div className="loading-spinner">Loading earnings data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="earnings-payments">
        <h5 className="section-title mb-3 enhanced-contrast-title">
          <i className="ri-money-dollar-circle-line me-2 text-warning"></i>
          Earnings & Payments
        </h5>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="earnings-payments">
      <h5 className="section-title mb-3 enhanced-contrast-title">
        <i className="ri-money-dollar-circle-line me-2 text-warning"></i>
        Earnings & Payments
      </h5>
      <Row>
        <Col lg="6">
          <Card className="earnings-summary-card mb-4">
            <CardBody>
              <h6 className="mb-3">Total Earnings</h6>
              <h3 className="text-success">
                ${(earnings.TotalEarnings || 0).toLocaleString()}
              </h3>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="earnings-summary-card mb-4">
            <CardBody>
              <h6 className="mb-3">Monthly Earnings</h6>
              <h3 className="text-primary">
                ${(earnings.MonthlyEarnings || 0).toLocaleString()}
              </h3>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <Card className="earnings-summary-card mb-4">
            <CardBody>
              <h6 className="mb-3">Total Rentals</h6>
              <h3 className="text-info">
                {earnings.TotalRentals || 0}
              </h3>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="earnings-summary-card mb-4">
            <CardBody>
              <h6 className="mb-3">Average Rental</h6>
              <h3 className="text-secondary">
                ${(earnings.AverageRental || 0).toFixed(2)}
              </h3>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <Card className="payouts-history-card">
            <CardBody>
              <h6 className="mb-3">Recent Payout History</h6>
              {earnings.recentPayouts && earnings.recentPayouts.length > 0 ? (
                earnings.recentPayouts.map((payout, index) => (
                  <div
                    key={index}
                    className="payout-item mb-3 border-top pt-2"
                  >
                    <div className="d-flex justify-content-between">
                      <span>{payout.title}</span>
                      <span className="text-success fw-bold">
                        +${payout.amount}
                      </span>
                    </div>
                    <small className="text-muted">{payout.date}</small>
                  </div>
                ))
              ) : (
                <div className="text-muted">No payout history available.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const RenteeEarningsandPayment = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchEarnings = async () => {
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
        const response = await fetch('http://localhost:5000/api/vehicle-owner/earnings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch earnings: ${response.statusText}`);
        }
        const data = await response.json();
        setEarnings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
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
                <EarningsAndPayments earnings={earnings} loading={loading} error={error} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeEarningsandPayment;
