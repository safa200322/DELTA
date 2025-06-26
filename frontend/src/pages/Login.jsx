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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/users/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phonenumber: formData.phone, password: formData.password }),
      });
      if (response.ok) {
        const data = await response.json();
        // Store the JWT token and user type in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.user.type);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id);
        
        // Show success message with specific user type
        alert(`Login successful as ${data.user.type}!`);
        
        // Redirect based on user type
        if (data.redirectTo) {
          navigate(data.redirectTo);
        } else {
          // Default redirect based on user type
          switch (data.user.type) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'chauffeur':
              navigate('/chauffeur/dashboard');
              break;
            case 'vehicle-owner':
              navigate('/vehicle-owner/profile');
              break;
            case 'user':
            default:
              navigate('/profile/ProfileOverview');
              break;
          }
        }
      } else {
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
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />

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
