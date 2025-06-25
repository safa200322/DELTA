import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ChauffeurLogin = () => {
  const navigate = useNavigate();

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
      PhoneNumber: formData.phone,
      Password: formData.password,
    };

    try {
      const response = await fetch("https://localhost:443/api/chauffeurs1/chauffeurs/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${result.message || "Unknown error"}`);
        return;
      }

      const { token, user } = result;

      if (token) {
        localStorage.setItem("jwtToken", token);
        if (user && user.id) {
          localStorage.setItem("userId", user.id);
        }
        alert("Login successful!");

        window.dispatchEvent(new Event("storage"));

        navigate("/profile/chauffeur-profile");
        return;
      } else {
        alert("Token not received.");
      }
    } catch (error) {
      console.error("Chauffeur login error:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="container-fluid vh-1000">
      <div className="row h-100">
        <div className="col-lg-6 d-none d-lg-block p-0">
          <img
            src="https://placehold.co/800x1200/667fff/ffffff.png?text=Chauffeur Login"
            alt="Background"
            className="img-fluid h-0 w-100 object-fit-cover"
          />
        </div>

        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
          <div className="p-4 w-100" style={{ maxWidth: "400px" }}>
            <h1 className="text-center mb-4 text-primary fw-bold">Chauffeur Login</h1>
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
              
                <a href="#" className="text-decoration-none text-primary">
                 
                </a>
              </p>
              <p>
                
                <a href="/login" className="text-decoration-none text-primary">
                  
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChauffeurLogin;
