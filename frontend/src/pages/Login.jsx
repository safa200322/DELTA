import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Step 1: Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate(); // ✅ Step 2: Initialize the navigation hook

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      phone: formData.phone,
      password: formData.password,
    };

    try {
      const response = await fetch("https://localhost:443/api/auth/users/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        const { token, user } = result;

        localStorage.setItem("jwtToken", token);
        if (user && user.id) {
          localStorage.setItem("userId", user.id); // <-- Save userId
        }
        alert("Login successful!");

        // Dispatch storage event to update Header state dynamically
        window.dispatchEvent(new Event("storage"));

        // ✅ Step 3: Navigate after success
        navigate("/profile/rentee-profile");
        return;
      } else {
        // User login failed, try admin login
        const adminResponse = await fetch("https://localhost:443/api/auth/admins/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const adminResult = await adminResponse.json();

        if (adminResponse.ok && adminResult.token) {
          const { token } = adminResult;

          localStorage.setItem("jwtToken", token);
          alert("Admin login successful!");

          // Dispatch storage event for header update
          window.dispatchEvent(new Event("storage"));

          // ✅ Navigate to admin dashboard
          navigate("/admin");
          return;
        } else {
          alert(`Login failed: ${adminResult.message || "Invalid credentials"}`);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="container-fluid vh-1000">
      <div className="row h-100">
        <div className="col-lg-6 d-none d-lg-block p-0">
          <img
            src="https://placehold.co/800x1200/667fff/ffffff.png?text=Welcome"
            alt="Background"
            className="img-fluid h-0 w-100 object-fit-cover"
          />
        </div>

        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="p-4 w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center mb-4 text-primary fw-bold">Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label fw-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control form-control-lg rounded-3"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember Me
                  </label>
                </div>
                <a href="#" className="text-decoration-none text-primary">
                  Forgot Password?
                </a>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <a href="#" className="text-decoration-none text-primary">
                  Sign Up Here
                </a>
              </p>
              <p>
                Vehicle Owner? Login from here{" "}
                <a href="/vehicleownnerlogin" className="text-decoration-none text-primary">
                  Vlogin
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
