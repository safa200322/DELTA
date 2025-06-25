import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/confirmation.css";

const stepRoutes = [
  { name: "Select vehicle", path: "/cars2" },
  { name: "Booking details", path: "/cars/:slug" },
  { name: "Extra Services", path: "/Extra" },
  { name: "Secure payment", path: "/payment" },
  { name: "Confirmation", path: "/home" }, // This page
];

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation-container text-center">
      <h2 className="mb-4">Booking will be confirmed by vehicle owner!</h2>
      <p className="mb-4">Would you like to revisit any section?</p>

      <div className="section-buttons d-flex flex-wrap justify-content-center gap-3">
        {stepRoutes.map((step, index) => (
          <button
            key={index}
            className="confirmation-step-circle"
            onClick={() => navigate(step.path)}
            title={`Go to ${step.name}`}
          >
            <span className="confirmation-step-number">{index + 1}</span>
            <span className="confirmation-step-label">{step.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Confirmation;
