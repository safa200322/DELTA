import React, { useState } from "react";
import "../styles/signup.css";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthday: "", // Added birthday
  });
  const [countryCode, setCountryCode] = useState("+90"); // Default country code

  // Helper to format phone as 5488550424 (no spaces, just digits)
  const formatPhone = (value) => {
    // Remove all non-digit characters
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

    // Validate required fields
    const { fullName, phone, email, password, confirmPassword, birthday } = formData;
    if (!fullName || !phone || !email || !password || !confirmPassword || !birthday) {
      alert("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Validate birthday format (YYYY-MM-DD)
    if (isNaN(Date.parse(birthday))) {
      alert("Please enter a valid birthday.");
      return;
    }
    // Check age limit (must be at least 22)
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 22) {
      alert("You must be at least 22 years old to rent a car.");
      return;
    }

    // Only send required fields to backend
    const signupData = {
      fullName,
      phone: countryCode + phone,
      email,
      password,
      birthday,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        // Instead of storing user data directly, we'll proceed to login
        const loginResponse = await fetch("http://localhost:5000/api/auth/users/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phonenumber: countryCode + formData.phone,
            password: formData.password
          }),
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          // Store the JWT token and user info
          localStorage.setItem('token', data.token);
          localStorage.setItem('userType', data.user ? data.user.type : 'user');
          localStorage.setItem('userName', data.user ? data.user.name : '');
          localStorage.setItem('userId', data.user ? data.user.id : '');
          alert("Account created successfully!");
          // Redirect to profile page
          navigate('/profile/ProfileOverview');
        } else {
          // Handle login failure after successful registration
          alert("Account created. Please login to continue.");
          navigate('/login');
        }
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
                placeholder="5488550424"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={15}
                style={{ flex: 1 }}
              />
            </div>

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
          <p className="login-text"> Vehicle owner? <a href="/vehicle-owner-signup">Sign up as a Vehicle Owner</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
