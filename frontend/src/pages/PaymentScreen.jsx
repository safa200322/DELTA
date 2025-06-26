import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    {
      name: "Select vehicle",
      label: "Select vehicle",
      active: currentStep >= 1,
    },
    {
      name: "Booking details",
      label: "Booking details",
      active: currentStep >= 2,
    },
    {
      name: "Secure payment",
      label: "Secure payment",
      active: currentStep >= 3,
    },
    { name: "Confirmation", label: "Confirmation", active: currentStep >= 4 },
  ];

  return (
    <div className="step-indicator mb-5">
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${(currentStep - 1) * 33.33}%` }}
        ></div>
      </div>
      <div className="steps d-flex justify-content-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-item ${step.active ? "active" : ""}`}
          >
            <div className="step-circle">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Add state for form fields
  const [form, setForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const paymentPayload = {
      ReservationID: state?.reservationId, // must match backend
      VehicleID: state?.vehicleId, // ensure this is passed in location state
      AccessoryID: state?.accessoryId || null, // optional
      ChauffeurID: state?.chauffeurId || null, // optional
      NameOnCard: form.nameOnCard,
      CardNumber: form.cardNumber,
      ExpiryDate: form.expiryDate,
      CVV: form.cvv,
      PaymentMethod: "Card", // or get from form if you support multiple
    };
    console.log("Payment payload:", paymentPayload);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload),
      });
      if (!res.ok) {
        let errorMsg = "Payment failed";
        try {
          const data = await res.json();
          errorMsg = data.error || data.message || errorMsg;
        } catch (jsonErr) {
          // fallback to text if not JSON
          const text = await res.text();
          if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
      }
      // Redirect to confirmation page
      navigate("/payment-success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDetails = () => {
    if (state?.vehicleType && state?.vehicleId) {
      navigate(`/vehicles/${state.vehicleType}/${state.vehicleId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container my-5">
      <StepIndicator currentStep={3} />
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h2 className="text-center text-primary mb-4">Payment Details</h2>
          <div className="card shadow">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nameOnCard" className="form-label">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameOnCard"
                    placeholder="Enter name as it appears on your card"
                    value={form.nameOnCard}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiryDate" className="form-label">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={form.expiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      placeholder="123"
                      value={form.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="billingAddress" className="form-label">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="billingAddress"
                    placeholder="Enter your billing address"
                    value={form.billingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={handleBackToDetails}
              className="btn btn-link text-primary"
            >
              Back to Details
            </button>
          </div>
          <p className="text-center text-muted mt-3">
            <small>Your payment information is securely encrypted.</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
