import React, { useState } from "react";
import "../styles/signup.css";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VehicleOwnerSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    PhoneNumber: "",
    NationalID: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.Password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare data for backend (exclude confirmPassword)
    const { confirmPassword, ...submitData } = formData;

    try {
      const response = await fetch("http://localhost:5000/api/vehicle-owner/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        // Auto-login after successful registration
        const loginResponse = await fetch("http://localhost:5000/api/vehicle-owner/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: formData.Email,
            Password: formData.Password
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
            <label htmlFor="FullName">Full Name</label>
            <input
              type="text"
              id="FullName"
              placeholder="Enter your full name"
              value={formData.FullName}
              onChange={handleChange}
              required
            />

            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              placeholder="Enter your email"
              value={formData.Email}
              onChange={handleChange}
              required
            />

            <label htmlFor="PhoneNumber">Phone Number</label>
            <input
              type="tel"
              id="PhoneNumber"
              placeholder="Enter your phone number"
              value={formData.PhoneNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor="NationalID">National ID</label>
            <input
              type="text"
              id="NationalID"
              placeholder="Enter your National ID"
              value={formData.NationalID}
              onChange={handleChange}
              required
            />

            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              placeholder="Choose a password"
              value={formData.Password}
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
