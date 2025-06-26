import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import "../styles/login.css";

const VehicleOwnerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/vehicle-owner/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.user ? data.user.type : 'vehicle-owner');
        localStorage.setItem('userName', data.user ? data.user.name : '');
        localStorage.setItem('userId', data.user ? data.user.id : '');
        alert("Login successful!");
        // Redirect to vehicle owner dashboard
        navigate('/vehicle-owner/profile');
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="right-pane">
        <div className="form-box">
          <h2>Vehicle Owner Login</h2>

          {error && (
            <div className="error-message" style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              placeholder="Enter your email"
              value={formData.Email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              placeholder="Enter your password"
              value={formData.Password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <div className="remember-forgot">
              <label>
                <input type="checkbox" disabled={loading} /> Remember Me
              </label>
              <a href="#" style={{ color: loading ? '#ccc' : '' }}>Forgot Password?</a>
            </div>

            <button type="submit" disabled={loading}>
              <FaSignInAlt /> {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="switch-text">
            Don't have a vehicle owner account? <Link to="/vehicle-owner/signup">Sign Up Here</Link>
          </p>
          <p className="switch-text">
            Are you a regular user? <Link to="/login">User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwnerLogin;
