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
    <div className="user-profile-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e6f0fa 0%, #fafdff 100%)' }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ background: '#185abc', minHeight: '100vh', padding: '32px 0 0 0', boxShadow: '2px 0 16px rgba(24,90,188,0.08)' }}>
        <h3 className="sidebar-title" style={{ color: '#fff', fontWeight: 700, marginBottom: 32, textAlign: 'center', letterSpacing: 1 }}>Personal Info</h3>
        <Nav vertical className="sidebar-nav" style={{ gap: 8 }}>
          <NavItem>
            <NavLink to="/profile/ProfileOverview" className="nav-link" activeClassName="active" style={{ color: '#fff', fontWeight: 500, borderRadius: 8, padding: '10px 20px', marginBottom: 4, background: '#2563eb' }}>
              <i className="ri-user-line me-2"></i> Profile Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/MyRentals" className="nav-link" activeClassName="active" style={{ color: '#e3eafc', fontWeight: 500, borderRadius: 8, padding: '10px 20px', marginBottom: 4 }}>
              <i className="ri-briefcase-line me-2"></i> My Rentals
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/MyPayments" className="nav-link" activeClassName="active" style={{ color: '#e3eafc', fontWeight: 500, borderRadius: 8, padding: '10px 20px', marginBottom: 4 }}>
              <i className="ri-calendar-line me-2"></i> Payments & Wallet
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/MyReviews" className="nav-link" activeClassName="active" style={{ color: '#e3eafc', fontWeight: 500, borderRadius: 8, padding: '10px 20px', marginBottom: 4 }}>
              <i className="ri-file-text-line me-2"></i> My Reviews
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/NotificationsProfile" className="nav-link" activeClassName="active" style={{ color: '#e3eafc', fontWeight: 500, borderRadius: 8, padding: '10px 20px', marginBottom: 4 }}>
              <i className="ri-settings-3-line me-2"></i> Notifications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/profile/AccountSettings" className="nav-link" activeClassName="active" style={{ color: '#e3eafc', fontWeight: 500, borderRadius: 8, padding: '10px 20px', marginBottom: 4 }}>
              <i className="ri-notification-3-fill me-2"></i> Account Settings
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ padding: '48px 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg="8">
              {/* Profile Picture Upload Section - Integrated into split panel */}
              {isEditingPicture && (
                <div className="profile-picture-section split-panel-upload" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(24,90,188,0.08)', padding: 32, marginBottom: 32 }}>
                  <h4 style={{ color: '#185abc', fontWeight: 600, marginBottom: 24 }}>Update Profile Picture</h4>
                  <ProfilePictureUpload
                    currentProfilePic={user.profilePic}
                    onSuccess={handleProfilePictureSuccess}
                  />
                  <button
                    className="cancel-button"
                    style={{ marginTop: 16, background: '#e6f0fa', color: '#185abc', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => setIsEditingPicture(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Profile Overview Section - Split Panel Design */}
              <div className="split-panel-profile-card" style={{ display: 'flex', background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px rgba(24,90,188,0.10)', overflow: 'hidden', minHeight: 260 }}>
                <div className="split-panel-left" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #185abc 100%)', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 220 }}>
                  <div className="split-panel-picture-container" style={{ position: 'relative', marginBottom: 16 }}>
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="split-panel-profile-pic"
                      style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 2px 12px rgba(24,90,188,0.10)' }}
                    />
                    <button
                      className="split-panel-change-btn"
                      style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#2563eb', border: 'none', borderRadius: 20, padding: '4px 18px', fontWeight: 600, fontSize: 14, boxShadow: '0 2px 8px rgba(24,90,188,0.10)', cursor: 'pointer', marginTop: 8 }}
                      onClick={() => setIsEditingPicture(true)}
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div className="split-panel-right" style={{ flex: 1, padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 className="split-panel-name" style={{ color: '#185abc', fontWeight: 700, fontSize: 32, marginBottom: 12 }}>{user.name}</h2>
                  <div className="split-panel-details" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="split-panel-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className="split-panel-label" style={{ color: '#7ea7e6', fontWeight: 500, minWidth: 90 }}>Email:</span>
                      <span className="split-panel-value" style={{ color: '#222', fontWeight: 500 }}>{user.email}</span>
                    </div>
                    <div className="split-panel-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className="split-panel-label" style={{ color: '#7ea7e6', fontWeight: 500, minWidth: 90 }}>Phone:</span>
                      <span className="split-panel-value" style={{ color: '#222', fontWeight: 500 }}>{user.phone}</span>
                    </div>
                    {user.birthday && (
                      <div className="split-panel-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span className="split-panel-label" style={{ color: '#7ea7e6', fontWeight: 500, minWidth: 90 }}>Birthday:</span>
                        <span className="split-panel-value" style={{ color: '#222', fontWeight: 500 }}>{formatDate(user.birthday)}</span>
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
