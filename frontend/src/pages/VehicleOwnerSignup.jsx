import React, { useState } from "react";
import "../styles/signup.css";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

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
  const [countryCode, setCountryCode] = useState("+90"); // Default country code

  // Helper to format phone as 5488550424 (no spaces, just digits)
  const formatPhone = (value) => {
    return value.replace(/\D/g, "");
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, PhoneNumber: formatted });
  };

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
    submitData.PhoneNumber = countryCode + formData.PhoneNumber;

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
          // Store the JWT token and user info
          localStorage.setItem('token', data.token);
          localStorage.setItem('userType', data.user ? data.user.type : 'vehicle-owner');
          localStorage.setItem('userName', data.user ? data.user.name : '');
          localStorage.setItem('userId', data.user ? data.user.id : '');
          alert("Vehicle Owner account created successfully!");
          // Redirect to vehicle owner dashboard
          navigate('/vehicle-owner/profile');
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                id="countryCode"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                style={{ width: '90px' }}
              >
                <option value="+90">+90</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                type="tel"
                id="PhoneNumber"
                placeholder="5488550424"
                value={formData.PhoneNumber}
                onChange={handlePhoneChange}
                maxLength={15}
                style={{ flex: 1 }}
                required
              />
            </div>

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
            Already have a vehicle owner account? <Link to="/vehicle-owner-login">Login here</Link>
          </p>
          <p className="login-text">
            Want to create a regular user account? <Link to="/signup">Sign up as User</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwnerSignUp;
