import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Container, Row, Col, Nav } from "reactstrap";
import "../styles/user-profile.css";
import VehicleManagement from "./VehicleManagement";
import AddVehicleForm from "./AddVehicleForm";

const UserProfileowner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [OwnerData, setOwnerData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [vehicleType, setVehicleType] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const OwnerID = location.state?.OwnerID || localStorage.getItem("OwnerID");

  useEffect(() => {
    if (location.state?.OwnerID) {
      localStorage.setItem("OwnerID", location.state.OwnerID);
    }
  }, [location.state]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return navigate("/login");

        const response = await fetch(`https://localhost:443/api/owner/ownerinfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setOwnerData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };

    fetchOwnerData();
  }, [navigate, OwnerID]);

  const handleVehicleSubmit = async (formData) => {
    try {
      formData.append("OwnerID", OwnerID);

      const response = await fetch("https://localhost:443/api/add/addvehicle", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add vehicle");

      const newVehicle = await response.json();
      setVehicles((prev) => [...prev, newVehicle]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

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
              <NavLink
                to="/reservationget"
                className="nav-link"
                activeClassName="active"
                style={{ padding: "10px", display: "block", color: "#000" }}
              >
                📅 Reservation Management
              </NavLink>
            </Nav>
          </Col>

          <Col xs="12" md="9" lg="10" className="content-area">
            <Row className="mt-4">
              <Col lg="8">
                <div className="profile-card d-flex align-items-center gap-4 mb-4">
                  <img
                    src={
                      OwnerData?.PhotoPath
                        ? `https://localhost:443/uploads/${OwnerData.PhotoPath}`
                        : "https://via.placeholder.com/100"
                    }
                    alt="Profile"
                    className="profile-pic"
                  />
                  <div className="profile-info">
                    <h3 className="mb-2">{OwnerData?.FullName || "Loading..."}</h3>
                    <p className="mb-1">
                      <strong>Email:</strong> {OwnerData?.Email || "Loading..."}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {OwnerData?.Phone || "Loading..."}
                    </p>
                    <p className="mb-0 d-flex align-items-center gap-2">
                      <strong>Verification:</strong>{" "}
                      <span className={OwnerData?.Verified ? "verified" : "unverified"}>
                        {OwnerData?.Verified ? "Verified ✅" : "Not Verified ❌"}
                      </span>
                    </p>
                  </div>
                </div>

                {!showForm && (
                  <div className="mb-4 d-flex gap-3 flex-wrap">
                    <button className="btn btn-sm btn-primary" onClick={() => navigate("/carform")}>
                      Add Car
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate("/MotorcycleForm")}>
                      Add Motorcycle
                    </button>
                    <button className="btn btn-sm btn-info" onClick={() => navigate("/boatform")}>
                      Add Boat
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => navigate("/bicycleform")}>
                      Add Bicycle
                    </button>
                  </div>
                )}

                {showForm ? (
                  <AddVehicleForm type={vehicleType} onSubmit={handleVehicleSubmit} />
                ) : (
                  <VehicleManagement vehicles={vehicles} />
                )}
              </Col>

              <Col lg="4">{/* Reserved for other cards */}</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default UserProfileowner;
