import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { name: "Select vehicle", label: "Select vehicle", active: currentStep >= 1 },
    { name: "Booking details", label: "Booking details", active: currentStep >= 2 },
    { name: "Extra Services", label: "Extra Services", active: currentStep >= 3 },
    { name: "Secure Payment", label: "Secure Payment", active: currentStep >= 3 },
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

  const userId = state?.userid || localStorage.getItem("userId");

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      name: nameOnCard,
      cardnumber: cardNumber,
      expiredate: expiryDate,
      cvv: cvv,
      Amount: amount,
      userid: userId,
      debitorcredit: paymentMethod,
      Status: "pending",
      reservationId: state.reservationId // ✅ Fixed line
    };

    try {
      const response = await fetch("https://localhost:443/api/payments/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert("Reservation request sent. Payment will process after confirmation.");
        navigate("/confirmation");
      } else {
        alert("Error processing payment.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Try again later.");
    }
  };

  const handleBackToDetails = () => {
    navigate(state?.carSlug ? `/cars/${state.carSlug}` : "/cars");
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
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    placeholder="Enter name as it appears on your card"
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
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
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
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
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
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter the amount"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="paymentMethod" className="form-label">
                    Payment Method
                  </label>
                  <select
                    className="form-select"
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Pay Now
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
