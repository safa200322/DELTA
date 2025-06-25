import React, { useState } from "react";
import "../styles/signup.css";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VehicleOwnerSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    phoneNumber: "",
    nationalID: "",
    profileImage: "",
    availability: "",
    totalEarnings: "",
    createdAt: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.passwordHash !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/vehicle-owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Auto-login after successful registration
        const loginResponse = await fetch("http://localhost:5000/api/auth/vehicle-owners/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.passwordHash
          }),
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          // Store the JWT token
          localStorage.setItem('token', data.token);
          alert("Vehicle Owner account created successfully!");
          // Redirect to vehicle owner dashboard
          navigate('/vehicle-owner/dashboard');
        } else {
          // Handle login failure after successful registration
          alert("Account created. Please login to continue.");
          navigate('/vehicle-owner/login');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="signup-container">
      <div className="right-pane">
        <div className="form-box">
          <h2>Create Vehicle Owner Account</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor="nationalID">National ID</label>
            <input
              type="text"
              id="nationalID"
              placeholder="Enter your National ID"
              value={formData.nationalID}
              onChange={handleChange}
              required
            />

            <label htmlFor="passwordHash">Password</label>
            <input
              type="password"
              id="passwordHash"
              placeholder="Choose a password"
              value={formData.passwordHash}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <label htmlFor="profileImage">Profile Image URL (Optional)</label>
            <input
              type="url"
              id="profileImage"
              placeholder="Enter profile image URL"
              value={formData.profileImage}
              onChange={handleChange}
            />

            <label htmlFor="availability">Availability</label>
            <select
              id="availability"
              value={formData.availability}
              onChange={handleChange}
              required
            >
              <option value="">Select availability</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Busy">Busy</option>
            </select>

            <label htmlFor="totalEarnings">Initial Total Earnings (Optional)</label>
            <input
              type="number"
              id="totalEarnings"
              placeholder="Enter initial total earnings (default: 0)"
              value={formData.totalEarnings}
              onChange={handleChange}
              min="0"
              step="0.01"
            />

            <label htmlFor="createdAt">Registration Date</label>
            <input
              type="date"
              id="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              required
            />

            <button type="submit">
              <FaUserPlus /> Create Vehicle Owner Account
            </button>
          </form>

          <p className="login-text">
            Already have a vehicle owner account? <a href="/vehicle-owner/login">Login here</a>
          </p>
          <p className="login-text">
            Want to create a regular user account? <a href="/signup">Sign up as User</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwnerSignUp;
