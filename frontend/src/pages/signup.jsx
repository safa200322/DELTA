import React, { useState } from "react";
import "../styles/signup.css";
import { FaUserPlus } from "react-icons/fa";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthday: "", // Added birthday
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Account created successfully!");
      } else {
        alert("Failed to create account. Please try again.");
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
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <label htmlFor="birthday">Birthday</label>
            <input
              type="date"
              id="birthday"
              placeholder="Enter your birthday"
              value={formData.birthday}
              onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Choose a password"
              value={formData.password}
              onChange={handleChange}
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button type="submit">
              <FaUserPlus /> Sign Up
            </button>
          </form>

          <p className="login-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
