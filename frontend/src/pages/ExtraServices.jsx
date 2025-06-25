import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { name: "Select vehicle", label: "Select vehicle", active: currentStep >= 1 },
    { name: "Booking details", label: "Booking details", active: currentStep >= 2 },
    { name: "Extra services", label: "Extra services", active: currentStep >= 3 },
    { name: "Secure payment", label: "Secure payment", active: currentStep >= 4 },
    { name: "Confirmation", label: "Confirmation", active: currentStep >= 5 },
  ];

  return (
    <div className="step-indicator mb-5">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${(currentStep - 1) * 25}%` }}></div>
      </div>
      <div className="steps d-flex justify-content-between">
        {steps.map((step, index) => (
          <div key={index} className={`step-item ${step.active ? "active" : ""}`}>
            <div className="step-circle">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExtraServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // DEBUG: log location.state on each render
  console.log("DEBUG location.state:", location.state);

  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    if (!location.state) {
      navigate("/cars");
    }
  }, [location.state, navigate]);

  const chauffeurAvailable = location.state?.chauffeur === "Available";
  const pricePerDay = location.state?.price || 0;
  const startDate = new Date(location.state?.startDate);
  const endDate = new Date(location.state?.endDate);

  // DEBUG: log key data
  console.log("DEBUG chauffeurAvailable:", chauffeurAvailable);
  console.log("DEBUG pricePerDay:", pricePerDay);
  console.log("DEBUG startDate:", startDate);
  console.log("DEBUG endDate:", endDate);

  const dayDiff = Math.max(
    1,
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  );

  const totalBasePrice = pricePerDay * dayDiff;

  const services = [
    { id: "gps", label: "GPS Navigation", price: 5 },
    { id: "childSeat", label: "Child Seat", price: 10 },
    { id: "wifi", label: "In-Car WiFi", price: 7 },
    chauffeurAvailable && { id: "extraDriver", label: "Additional Driver", price: 15 },
    { id: "roadside", label: "Roadside Assistance", price: 8 },
  ].filter(Boolean);

  const handleToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContinue = () => {
    // DEBUG: log before navigating to payment
    console.log("DEBUG Navigating to /payment with state:", {
      ...location.state,
      selectedServices,
      totalBasePrice,
    });

    navigate("/payment", {
      state: {
        ...location.state,
        selectedServices,
        totalBasePrice,
      },
    });
  };

  return (
    <div className="container my-5">
      <StepIndicator currentStep={3} />

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h2 className="text-center text-primary mb-4">Choose Extra Services</h2>

          <p className="text-center text-muted">
             Price for {dayDiff} day{dayDiff > 1 ? "s" : ""}: <strong>${totalBasePrice}</strong>
          </p>

          <div className="card shadow">
            <div className="card-body">
              <form>
                {services.map((service) => (
                  <div className="form-check mb-3" key={service.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleToggle(service.id)}
                    />
                    <label className="form-check-label" htmlFor={service.id}>
                      {service.label} <span className="text-muted">(${service.price})</span>
                    </label>
                  </div>
                ))}

                <div className="d-grid mt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleContinue}
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-3">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-link text-primary"
            >
              Back to Booking Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraServices;
