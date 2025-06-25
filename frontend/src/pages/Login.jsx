import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import "../styles/login.css";

const Login = () => {
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
        alert("Login successful!");
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
