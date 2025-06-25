import React from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import "../styles/login.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="right-pane ">
        <div className="form-box">
          <h2>Login</h2>
          <form>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />

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
