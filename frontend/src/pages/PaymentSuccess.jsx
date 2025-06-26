import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="container my-5 text-center">
      <div className="card shadow p-5">
        <h2 className="text-success mb-3">Payment Successful!</h2>
        <p className="mb-4">Thank you for your payment. Your booking is now confirmed.</p>
        <Link to="/profile/MyRentals" className="btn btn-primary mb-2">
          View My Rentals
        </Link>
        <br />
        <Link to="/home" className="btn btn-link">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
