import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import ProfilePictureUpload from "../../components/UI/ProfilePictureUpload";
import "../../styles/user-profile.css";

const ProfileOverview = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    profilePic: "http://localhost:5000/uploads/profile-pictures/default.svg",
    isVerified: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingPicture, setIsEditingPicture] = useState(false);

  const formatDate = (isoString) => {
    if (!isoString || isoString === "Not provided") {
      return "Not provided";
    }

    const date = new Date(isoString);
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = months[monthIndex];

    const getOrdinalSuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          // Redirect to login if no token exists
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Token expired or invalid
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch profile data');
        }

        const userData = await response.json();
        setUser({
          name: userData.fullName || userData.username || "User",
          email: userData.email || "Not provided",
          phone: userData.phone || "Not provided",
          profilePic: userData.profilePictureUrl || "http://localhost:5000/uploads/profile-pictures/default.svg",
          isVerified: !!userData.isVerified,
          birthday: userData.birthday || "Not provided"
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfilePictureSuccess = (newProfilePicUrl) => {
    setUser(prevUser => ({
      ...prevUser,
      profilePic: newProfilePicUrl
    }));
    setIsEditingPicture(false);
  };

  const formatBirthday = (isoDate) => {
    if (!isoDate || isoDate === "Not provided") {
      return "Not provided";
    }

    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const getDayWithOrdinal = (d) => {
      if (d > 3 && d < 21) return `${d}th`;
      switch (d % 10) {
        case 1: return `${d}st`;
        case 2: return `${d}nd`;
        case 3: return `${d}rd`;
        default: return `${d}th`;
      }
    };

    return `${getDayWithOrdinal(day)} ${month} ${year}`;
  };

  if (loading) {
    return <div className="loading-spinner">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="user-profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="sidebar-title">User Profile</h3>
        <Nav vertical className="sidebar-nav">
          <NavItem>
            <NavLink
              to="/profile/ProfileOverview"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-user-line"></i> Profile Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyRentals"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-briefcase-line"></i> My Rentals
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyPayments"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-calendar-line"></i> Payments & Wallet
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/MyReviews"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-file-text-line"></i> My Reviews
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/NotificationsProfile"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-settings-3-line"></i> Notifications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/profile/AccountSettings"
              className="nav-link"
              activeClassName="active"
            >
              <i className="ri-notification-3-fill"></i> Account Settings
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg="8">
              {/* Profile Picture Upload Section - Integrated into split panel */}
              {isEditingPicture && (
                <div className="profile-picture-section split-panel-upload">
                  <h4>Update Profile Picture</h4>
                  <ProfilePictureUpload
                    currentProfilePic={user.profilePic}
                    onSuccess={handleProfilePictureSuccess}
                  />
                  <button
                    className="cancel-button"
                    onClick={() => setIsEditingPicture(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Profile Overview Section - Split Panel Design */}
              <div className="split-panel-profile-card">
                <div className="split-panel-left">
                  <div className="split-panel-picture-container">
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="split-panel-profile-pic"
                    />
                    <button
                      className="split-panel-change-btn"
                      onClick={() => setIsEditingPicture(true)}
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div className="split-panel-right">
                  <h2 className="split-panel-name">{user.name}</h2>
                  <div className="split-panel-details">
                    <div className="split-panel-detail-row">
                      <span className="split-panel-label">Email:</span>
                      <span className="split-panel-value">{user.email}</span>
                    </div>
                    <div className="split-panel-detail-row">
                      <span className="split-panel-label">Phone:</span>
                      <span className="split-panel-value">{user.phone}</span>
                    </div>
                    {user.birthday && (
                      <div className="split-panel-detail-row">
                        <span className="split-panel-label">Birthday:</span>
                        <span className="split-panel-value">{formatDate(user.birthday)}</span>
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ProfileOverview;
