import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "../../styles/user-profile.css";
import "../../styles/vehicle-owner.css";
import VehicleManagement from "../VehicleManagement";
import VehicleOwnerProfileEdit from "../../components/VehicleOwnerProfileEdit";
import RenteeSidebar from "../../components/RenteeSidebar";

const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProfileModal, setEditProfileModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleEditProfile = () => setEditProfileModal(!editProfileModal);

  const handleProfileUpdate = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  useEffect(() => {
    fetchUserProfile();
    fetchEarnings();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/vehicle-owner/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to fetch profile data");
    }
  };

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/vehicle-owner/earnings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const earningsData = await response.json();
        setEarnings(earningsData);
      } else {
        console.error("Failed to fetch earnings");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/vehicle-owner/profile/picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setUser((prev) => ({
          ...prev,
          ProfileImage: result.profileImageUrl,
        }));
        alert("Profile picture updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger text-center">
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <div className="alert alert-warning text-center">
          <h4>No User Data</h4>
          <p>Unable to load user profile</p>
        </div>
      </Container>
    );
  }

  return (
    <section style={{ marginTop: "10px" }}>
      <Container fluid>
        <Row>
          <RenteeSidebar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Rentee Profile"
          />

          <Col xs="12" md="9" lg="10" className="content-area">
            <Row className="mt-4 justify-content-center">
              <Col lg="7">
                <div className="profile-card shadow p-4 mb-4 bg-white rounded-4 d-flex align-items-center gap-4 flex-wrap flex-md-nowrap">
                  <div className="profile-pic-container position-relative mx-auto mx-md-0">
                    <img
                      src={
                        user.ProfileImage
                          ? `http://localhost:5000${user.ProfileImage}`
                          : "https://i.pravatar.cc/150?img=3"
                      }
                      alt="Profile"
                      className="profile-pic border border-2 border-primary"
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: "50%",
                        objectFit: "cover",
                        background: "#f8f9fa",
                      }}
                    />
                    <label
                      htmlFor="profilePictureUpload"
                      className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow-sm"
                      style={{
                        cursor: "pointer",
                        fontSize: 13,
                        border: "2px solid #fff",
                      }}
                    >
                      <i className="ri-camera-line"></i>
                    </label>
                    <input
                      id="profilePictureUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="profile-info flex-grow-1">
                    <h2
                      className="fw-bold mb-1"
                      style={{ fontSize: "2rem", color: "#222" }}
                    >
                      {user.FullName}
                    </h2>
                    <div className="d-flex flex-wrap gap-3 align-items-center mb-2">
                      <span className="text-muted">
                        <i className="ri-mail-line me-1"></i> {user.Email}
                      </span>
                      <span className="text-muted">
                        <i className="ri-phone-line me-1"></i> {user.PhoneNumber}
                      </span>
                    </div>
                    <div className="d-flex flex-wrap gap-3 align-items-center mb-2">
                      <span className="text-muted">
                        <i className="ri-id-card-line me-1"></i> {user.NationalID}
                      </span>
                      <span className="badge bg-success ms-2">
                        {user.Availability || "Available"}
                      </span>
                    </div>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={toggleEditProfile}
                      className="mt-2 px-4 rounded-pill shadow-sm"
                    >
                      <i className="ri-edit-line me-1"></i> Edit Profile
                    </Button>
                  </div>
                </div>
                <div className="earnings-card shadow-sm p-4 bg-white rounded-4 mb-4">
                  <h5 className="section-title mb-3">
                    <i className="ri-money-dollar-circle-line me-2 text-warning"></i>
                    Earnings & Payments
                  </h5>
                  <div className="earnings-summary d-flex gap-4 mb-3 flex-wrap">
                    <div className="earn-box text-center flex-fill">
                      <h3
                        className="fw-bold text-success mb-0"
                        style={{ fontSize: "1.7rem" }}
                      >
                        ${earnings?.TotalEarnings?.toLocaleString() || "0"}
                      </h3>
                      <div className="text-muted" style={{ fontSize: 14 }}>
                        Total Earnings
                      </div>
                    </div>
                    <div className="earn-box text-center flex-fill">
                      <h3
                        className="fw-bold text-primary mb-0"
                        style={{ fontSize: "1.7rem" }}
                      >
                        ${earnings?.MonthlyEarnings?.toLocaleString() || "0"}
                      </h3>
                      <div className="text-muted" style={{ fontSize: 14 }}>
                        This Month
                      </div>
                    </div>
                  </div>
                  <div className="recent-payouts mt-3">
                    <h6 className="text-muted mb-2">Recent Payouts</h6>
                    {earnings?.recentPayouts?.length > 0 ? (
                      earnings.recentPayouts.map((payout, i) => (
                        <div
                          key={i}
                          className="payout-item mb-2 border-top pt-2 d-flex justify-content-between align-items-center"
                        >
                          <span className="fw-semibold">{payout.title}</span>
                          <span className="text-success fw-bold">
                            +${payout.amount}
                          </span>
                          <small className="text-muted ms-2">{payout.date}</small>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0">No recent payouts</p>
                    )}
                  </div>
                </div>
              </Col>
              <Col lg="5">
                <div className="account-settings-card shadow-sm p-4 bg-white rounded-4 mb-4">
                  <h5 className="section-title mb-3">
                    <i className="ri-user-settings-line me-2 text-primary"></i>
                    Account Settings
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="account-box p-3 border rounded text-center h-100 bg-light">
                        <div className="mb-2">
                          <i
                            className="ri-lock-line text-warning"
                            style={{ fontSize: 24 }}
                          ></i>
                        </div>
                        <h6 className="fw-bold">Security</h6>
                        <p className="text-muted mb-2" style={{ fontSize: 14 }}>
                          Change password & security settings
                        </p>
                        <Button
                          color="primary"
                          size="sm"
                          className="rounded-pill px-3"
                        >
                          Manage Security
                        </Button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="account-box p-3 border rounded text-center h-100 bg-light">
                        <div className="mb-2">
                          <i
                            className="ri-close-circle-line text-danger"
                            style={{ fontSize: 24 }}
                          ></i>
                        </div>
                        <h6 className="fw-bold">Account Actions</h6>
                        <p className="text-muted mb-2" style={{ fontSize: 14 }}>
                          Delete or deactivate your account
                        </p>
                        <Button
                          color="danger"
                          size="sm"
                          className="rounded-pill px-3"
                        >
                          Manage Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Profile Edit Modal */}
      <VehicleOwnerProfileEdit
        isOpen={editProfileModal}
        toggle={toggleEditProfile}
        currentUser={user}
        onProfileUpdate={handleProfileUpdate}
      />
    </section>
  );
};

export default UserProfile;
