import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import "../../styles/user-profile.css";
import ChaffeurVehicleManagement from "../../pages/ChauffeurWorkAvailability";
import RenteeSidebar from "../../components/RenteeSidebar";

const RenteeReviews = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const user = {
    name: "Umussdffssuuuuut Umutttttcuuuuuk",
    email: "umutcuk@gmail.com",
    phone: "+90 500 000 0000",
    profilePic: "https://i.pravatar.cc/150?img=3",
    isVerified: true,
  };

  const earnings = {
    total: 2840,
    monthly: 450,
    payouts: [
      {
        title: "Honda CR-V Rental",
        date: "May 25, 2025",
        amount: 180,
      },
      {
        title: "Toyota Camry Rental",
        date: "May 18, 2025",
        amount: 270,
      },
    ],
  };

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
              <Col lg="8">
                <div className="profile-card d-flex align-items-center gap-4 mb-4">
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="profile-pic"
                  />
                  <div className="profile-info">
                    <h3 className="mb-2">{user.name}</h3>
                    <p className="mb-1">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {user.phone}
                    </p>
                    <p className="mb-0">
                      <strong>Verification:</strong>{" "}
                      {user.isVerified ? (
                        <span className="verified">ID Verified ✅</span>
                      ) : (
                        <span className="unverified">Not Verified ❌</span>
                      )}
                    </p>
                  </div>
                </div>
                <ChaffeurVehicleManagement />
                {/* Buraya araç yönetimi veya başka şeyler */}
                <div className="vehicle-management">{/* future use */}</div>
              </Col>

              <Col lg="4">
                <div className="earnings-card">
                  <h5 className="section-title">
                    <i className="ri-money-dollar-circle-line me-2 text-warning"></i>
                    Earnings & Payments
                  </h5>

                  <div className="earnings-summary d-flex gap-3 mb-3">
                    <div className="earn-box">
                      <h3>${earnings.total.toLocaleString()}</h3>
                      <p>Total Earnings</p>
                    </div>
                    <div className="earn-box">
                      <h3>${earnings.monthly}</h3>
                      <p>This Month</p>
                    </div>
                  </div>

                  <div className="recent-payouts">
                    <h6 className="text-muted">Recent Payouts</h6>
                    {earnings.payouts.map((p, i) => (
                      <div key={i} className="payout-item mb-3 border-top pt-2">
                        <div className="d-flex justify-content-between">
                          <span>{p.title}</span>
                          <span className="text-success fw-bold">
                            +${p.amount}
                          </span>
                        </div>
                        <small className="text-muted">{p.date}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="account-settings-card mt-4">
                  <h5 className="section-title mb-3">
                    <i className="ri-user-settings-line me-2 text-primary"></i>
                    Account Settings
                  </h5>

                  <div className="row g-3">
                    <div className="col-6">
                      <div className="account-box p-3 border rounded text-center h-100">
                        <div className="mb-2">
                          <i
                            className="ri-lock-line text-warning"
                            style={{ fontSize: "24px" }}
                          ></i>
                        </div>
                        <h6 className="fw-bold">Security</h6>
                        <p
                          className="text-muted mb-2"
                          style={{ fontSize: "14px" }}
                        >
                          Change password & security settings
                        </p>
                        <button className="btn btn-primary btn-sm">
                          Manage Security
                        </button>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="account-box p-3 border rounded text-center h-100">
                        <div className="mb-2">
                          <i
                            className="ri-close-circle-line text-danger"
                            style={{ fontSize: "24px" }}
                          ></i>
                        </div>
                        <h6 className="fw-bold">Account Actions</h6>
                        <p
                          className="text-muted mb-2"
                          style={{ fontSize: "14px" }}
                        >
                          Delete or deactivate your account
                        </p>
                        <button className="btn btn-danger btn-sm">
                          Manage Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RenteeReviews;
