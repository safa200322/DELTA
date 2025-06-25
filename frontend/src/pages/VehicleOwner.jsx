import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import navigation hook
import "bootstrap/dist/css/bootstrap.min.css";

const VehicleOwner = () => {
  const navigate = useNavigate(); // <-- Initialize navigation

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    nationalId: "",
  });

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("fullName", formData.fullName);
    formPayload.append("email", formData.email);
    formPayload.append("password", formData.password);
    formPayload.append("phone", formData.phone);
    formPayload.append("nationalId", formData.nationalId);
    if (photo) {
      formPayload.append("photo", photo);
    }

    try {
      const response = await fetch("https://localhost:443/api/owner/vehicleowner", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Registration failed";

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage += `: ${errorData.message || "Unknown error"}`;
        } else {
          const text = await response.text();
          errorMessage += `: ${text}`;
        }

        alert(errorMessage);
        return;
      }

      alert("Vehicle owner registration successful!");
      navigate("/login"); // <-- Navigate after success
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        {/* Left image section */}
        <div className="col-lg-6 d-none d-lg-block p-0">
          <img
            src="https://placehold.co/800x1200/ff8866/ffffff.png?text=Vehicle+Owner"
            alt="Vehicle Owner Background"
            className="img-fluid w-100 h-100 object-fit-cover"
          />
        </div>

        {/* Right form section */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="p-4 p-md-5 w-100" style={{ maxWidth: "450px" }}>
            <h1 className="text-center mb-4 text-primary fw-bold display-5">
              Vehicle Owner Sign Up
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label fw-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg rounded-3"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label fw-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control form-control-lg rounded-3"
                  id="phone"
                  value={formData.phone}
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
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="Enter your national ID"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Choose a password"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Upload Photo */}
              <div className="mb-4">
                <label htmlFor="photo" className="form-label fw-medium">
                  Upload Photo
                </label>
                <input
                  type="file"
                  className="form-control form-control-lg rounded-3"
                  id="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid mb-4">
                <button type="submit" className="btn btn-primary btn-lg rounded-3">
                  Register as Vehicle Owner
                </button>
              </div>
            </form>

            {/* Back Link */}
            <div className="text-center">
              <p className="mb-0">
                Want to sign up as a user?{" "}
                <a href="/signup" className="text-primary text-decoration-none fw-medium">
                  Go back
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwner;
