import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    birthday: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const dataToSend = {
    fullName: formData.fullName,
    
    birthday: formData.birthday,
    email: formData.email,
    phone: formData.phone,
    password: formData.password
    // 🔒 Do NOT send confirmPassword unless the API needs it
  };

    try {
      const response = await fetch("https://localhost:443/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message || "Unknown error"}`);
        return;
      }

      const result = await response.json();
      alert("Sign-up successful!");

      // Optionally redirect or clear the form
      // window.location.href = "/login";

    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during sign-up.");
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        {/* Left: Welcome Image */}
        <div className="col-lg-6 d-none d-lg-block p-0">
          <img
            src="https://placehold.co/800x1200/667fff/ffffff.png?text=Welcome"
            alt="Welcome Background"
            className="img-fluid w-100 h-100 object-fit-cover"
          />
        </div>

        {/* Right: Sign-Up Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="p-4 p-md-5 w-100" style={{ maxWidth: "450px" }}>
            <h1 className="text-center mb-4 text-primary fw-bold display-5">
              Sign Up
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label fw-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username Field */}
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-medium">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-3"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />
              </div>

              {/* Birthday Field */}
              <div className="mb-3">
                <label htmlFor="birthday" className="form-label fw-medium">
                  Birthday
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg rounded-3"
                  id="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  placeholder="Choose a birthday"
                />
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg rounded-3"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Number Field */}
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

              {/* Password Field */}
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
                  placeholder="Choose a password"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label fw-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg rounded-3"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid mb-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg rounded-3"
                >
                  Sign Up
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="mb-0">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary text-decoration-none fw-medium"
                >
                  Login Here
                </a>
              </p>
            </div>
             <div className="text-center">
              <p className="mb-0">
                Do you want to be vehicle owner?{" "}
                <a
                  href="/owner"
                  className="text-primary text-decoration-none fw-medium"
                >
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
