import React, { useEffect, useState } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Nav } from "reactstrap";
import "../styles/user-profile.css";

const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Get userID from login state or localStorage
  const userID = location.state?.userID || localStorage.getItem("userID");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return navigate("/login");

        const response = await fetch("https://localhost:443/api/profile/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <section style={{ marginTop: "10px" }}>
      <Container fluid>
        <Row>
          <Col xs="12" md="3" lg="2" className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
            <div className="sidebar-header">
              <h3>Rentee Profile</h3>
              <i className="ri-menu-line sidebar-toggle d-md-none" onClick={toggleSidebar}></i>
            </div>
            <Nav vertical className="sidebar-nav">
              {/* Sidebar content is empty now */}
            </Nav>
          </Col>

          <Col xs="12" md="9" lg="10" className="content-area">
            <Row className="mt-4">
              <Col lg="8">
                <div className="profile-card d-flex align-items-center gap-4 mb-4">
                  <img
                    src={userData?.ProfileImage || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="profile-pic"
                  />
                  <div className="profile-info">
                    <h3 className="mb-2">{userData?.Name || "Loading..."}</h3>
                    <p className="mb-1">
                      <strong>Email:</strong> {userData?.Email || "Loading..."}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {userData?.PhoneNumber || "Loading..."}
                    </p>
                    <p className="mb-0 d-flex align-items-center gap-2">
                      <strong>Verification:</strong>{" "}
                      <span className={userData?.Verified ? "verified" : "unverified"}>
                        {userData?.Verified ? "Verified ✅" : "Not Verified ❌"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* No vehicle management or add vehicle form */}

              </Col>

              <Col lg="4">{/* Reserved for other cards */}</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default UserProfile;
