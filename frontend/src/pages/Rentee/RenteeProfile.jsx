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
    setUser(prev => ({
      ...prev,
      ...updatedData
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
            title="Vehicle Owner Profile"
            customNavItems={[
              {
                to: "/vehicle-owner/profile",
                icon: "ri-user-line",
                label: "Personal Info"
              },
              {
                to: "/profile/rentee-vehicle-management",
                icon: "ri-briefcase-line", 
                label: "Vehicle Management"
              },
              {
                to: "/profile/rentee-rental-reservations",
                icon: "ri-calendar-line",
                label: "Rental Reservations"
              },
              {
                to: "/profile/rentee-earnings-and-payments",
                icon: "ri-file-text-line",
                label: "Earnings & Payments"
              },
              {
                to: "/profile/rentee-notifications",
                icon: "ri-notification-line",
                label: "Notifications"
              },
              {
                to: "/profile/rentee-reviews",
                icon: "ri-star-line",
                label: "Reviews"
              },
              {
                to: "/profile/rentee-security",
                icon: "ri-shield-line",
                label: "Security"
              }
            ]}
          />

          <Col xs="12" md="9" lg="10" className="content-area">
            <Row className="mt-4">
              <Col lg="8">
                <div className="profile-card d-flex align-items-center gap-4 mb-4">
                  <div className="profile-pic-container position-relative">
                    <img
                      src={
                        user.ProfileImage
                          ? `http://localhost:5000${user.ProfileImage}`
                          : "https://i.pravatar.cc/150?img=3"
                      }
                      alt="Profile"
                      className="profile-pic"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <label
                      htmlFor="profilePictureUpload"
                      className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer"
                      style={{ cursor: "pointer", fontSize: "12px" }}
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
                  <div className="profile-info">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h3 className="mb-2">{user.FullName}</h3>
                        <p className="mb-1">
                          <strong>Email:</strong> {user.Email}
                        </p>
                        <p className="mb-1">
                          <strong>Phone:</strong> {user.PhoneNumber}
                        </p>
                        <p className="mb-1">
                          <strong>National ID:</strong> {user.NationalID}
                        </p>
                        <p className="mb-0">
                          <strong>Status:</strong>{" "}
                          <span className="badge bg-success">
                            {user.Availability || "Available"}
                          </span>
                        </p>
                        <p className="mb-0 mt-1">
                          <strong>Member since:</strong>{" "}
                          {new Date(user.CreatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        color="primary" 
                        size="sm" 
                        onClick={toggleEditProfile}
                        className="ms-3"
                      >
                        <i className="ri-edit-line me-1"></i>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
                <VehicleManagement />
              </Col>

              <Col lg="4">
                <div className="earnings-card">
                  <h5 className="section-title">
                    <i className="ri-money-dollar-circle-line me-2 text-warning"></i>
                    Earnings & Payments
                  </h5>

                  <div className="earnings-summary d-flex gap-3 mb-3">
                    <div className="earn-box">
                      <h3>
                        ${earnings?.TotalEarnings?.toLocaleString() || "0"}
                      </h3>
                      <p>Total Earnings</p>
                    </div>
                    <div className="earn-box">
                      <h3>
                        ${earnings?.MonthlyEarnings?.toLocaleString() || "0"}
                      </h3>
                      <p>This Month</p>
                    </div>
                  </div>

                  <div className="recent-payouts">
                    <h6 className="text-muted">Recent Payouts</h6>
                    {earnings?.recentPayouts?.length > 0 ? (
                      earnings.recentPayouts.map((payout, i) => (
                        <div key={i} className="payout-item mb-3 border-top pt-2">
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
                      <p className="text-muted">No recent payouts</p>
                    )}
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
