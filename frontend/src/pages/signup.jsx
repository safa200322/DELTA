import React from "react";
import "../styles/signup.css";
import { FaUserPlus } from "react-icons/fa";

const SignUpPage = () => {
  return (
    <div className="signup-container">
      <div className="right-pane">
        <div className="form-box">
          <h2>Create Account</h2>

          <form>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Enter your full name" />

            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Choose a username" />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />

            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" placeholder="Enter your phone number" />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Choose a password" />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm your password" />

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
