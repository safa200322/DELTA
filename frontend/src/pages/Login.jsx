import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [countryCode, setCountryCode] = useState("+90"); // Default country code

  // Helper to format phone as only digits (no spaces, no brackets)
  const formatPhone = (value) => {
    return value.replace(/\D/g, "");
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', { phone: countryCode + formData.phone });
    try {
      const response = await fetch("http://localhost:5000/api/auth/users/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phonenumber: countryCode + formData.phone, password: formData.password }),
      });
      console.log('Login response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Login success:', data);
        // Store the JWT token and user type in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.user.type);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id);

        // Show success message with specific user type
        alert(`Login successful as ${data.user.type}!`);

        // Redirect based on user type
        navigate('/profile/ProfileOverview');
      } else {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="right-pane ">
        <div className="form-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="phone">Phone Number</label>
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
                id="phone"
                placeholder="(548) 855 04 24"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={16}
                style={{ flex: 1 }}
              />
            </div>

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">
              <FaSignInAlt /> Login
            </button>
          </form>

          <p className="switch-text">
            Don’t have an account? <Link to="/signup">Sign Up Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
