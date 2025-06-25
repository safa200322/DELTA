import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const VehicleownerLogin = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    phone: "",
    nationalId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      Phone: credentials.phone,
      Password: credentials.password,
      NationalID: credentials.nationalId,
    };

    try {
      const response = await fetch("https://localhost:443/api/owner/ownerlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (!response.ok) {
        alert(`Login failed: ${data.message || "Invalid credentials"}`);
        return;
      }

      if (!data.token) {
        console.warn("No token in login response!");
      } else {
        localStorage.setItem("jwtToken", data.token);
        console.log("Token saved:", localStorage.getItem("jwtToken"));

        // Notify current tab about login change
        window.dispatchEvent(new Event("storage"));
      }

      // Store owner details in localStorage
      localStorage.setItem("OwnerID", data.OwnerID);
      localStorage.setItem("OwnerName", data.FullName);
      localStorage.setItem("OwnerEmail", data.Email);
      localStorage.setItem("OwnerPhone", data.Phone);

      // Store VehicleIDs (as array of numbers)
      if (data.VehicleID && Array.isArray(data.VehicleID)) {
        const vehicleIds = data.VehicleID.map((v) => v.VehicleID);
        localStorage.setItem("VehicleIDs", JSON.stringify(vehicleIds));

        // DEBUG: confirm save
        const savedVehicleIDs = JSON.parse(localStorage.getItem("VehicleIDs"));
        console.log("✅ VehicleIDs saved to localStorage:", savedVehicleIDs);
      } else {
        console.warn("⚠️ No VehicleIDs returned or invalid format:", data.VehicleID);
      }

      alert("Login successful!");

      // Pass OwnerID via navigate state too
      navigate("/userprofileowner", { state: { OwnerID: data.OwnerID } });
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        {/* Left image section */}
        <div className="col-lg-6 d-none d-lg-block p-0">
          <img
            src="https://placehold.co/800x1200/88ccff/ffffff.png?text=Vehicle+Owner+Login"
            alt="Login Background"
            className="img-fluid w-100 h-100 object-fit-cover"
          />
        </div>

        {/* Right form section */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="p-4 p-md-5 w-100" style={{ maxWidth: "450px" }}>
            <h1 className="text-center mb-4 text-primary fw-bold display-5">
              Vehicle Owner Login
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Phone Number */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label fw-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control form-control-lg rounded-3"
                  id="phone"
                  value={credentials.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              {/* National ID */}
              <div className="mb-3">
                <label htmlFor="nationalId" className="form-label fw-medium">
                  National ID
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  id="nationalId"
                  value={credentials.nationalId}
                  onChange={handleChange}
                  placeholder="Enter your national ID"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  id="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid mb-4">
                <button type="submit" className="btn btn-primary btn-lg rounded-3">
                  Login
                </button>
              </div>
            </form>

            {/* Back Link */}
            <div className="text-center">
              <p className="mb-0">
                Don't have an account?{" "}
                <a href="/owner" className="text-primary text-decoration-none fw-medium">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleownerLogin;
