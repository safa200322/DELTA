import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import PaymentMethod from "../components/UI/PaymentMethod";
import LocationPickerModal from "../components/UI/LocationPickerModal";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { name: "Select vehicle", label: "Select vehicle", active: currentStep >= 1 },
    { name: "Booking details", label: "Booking details", active: currentStep >= 2 },
    { name: "Secure payment", label: "Secure payment", active: currentStep >= 3 },
    { name: "Confirmation", label: "Confirmation", active: currentStep >= 4 },
  ];
  const progressWidth = steps.length <= 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100;
  return (
    <div className="step-indicator mb-5">
      <div className="progress-bar-container">
        <div className="progress-bar-background"></div>
        <div className="progress-bar" style={{ width: `${progressWidth}%` }}></div>
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

const VehicleDetails = () => {
  const { slug, type } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Booking state
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [dropoffDateTime, setDropoffDateTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationModalType, setLocationModalType] = useState("pickup");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { state: { redirectTo: `/vehicles/${type}/${slug}`, message: "Please log in to view vehicle details and make bookings." } });
          return;
        }
        const response = await fetch("http://localhost:5000/api/auth/users/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            navigate("/login", { state: { redirectTo: `/vehicles/${type}/${slug}`, message: "Your session has expired. Please log in again." } });
          }
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
        navigate("/login", { state: { redirectTo: `/vehicles/${type}/${slug}`, message: "Could not retrieve your profile. Please log in again." } });
      }
    };
    checkAuthAndFetchUser();
  }, [navigate, slug, type]);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:5000/api/vehicles/filter?type=${type}&slug=${slug}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setVehicle(data[0] || null);
        } else {
          setVehicle(null);
        }
      } catch (error) {
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleData();
  }, [slug, type]);

  const handleGoToPayment = async () => {
    setBookingError("");
    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const reservationPayload = {
        vehicleId: vehicle?.VehicleID || vehicle?.id || slug,
        pickupDateTime,
        dropoffDateTime,
        pickupLocation,
        dropoffLocation,
        // Add more fields as needed
      };
      const res = await fetch("http://localhost:5000/api/reservations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationPayload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to create reservation");
      }
      const reservation = await res.json();
      navigate("/payment", {
        state: {
          vehicleType: type,
          vehicleId: vehicle?.VehicleID || vehicle?.id || slug,
          reservationId: reservation.reservationId,
        },
      });
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  // Render details based on type
  return (
    <div className="vehicle-details-page">
      <Helmet title={`${type.charAt(0).toUpperCase() + type.slice(1)} Details`} />
      <StepIndicator currentStep={1} />
      <div className="vehicle-info">
        <h2>{vehicle.model || vehicle.name}</h2>
        <p>Type: {type}</p>
        <p>Price: {vehicle.Price || vehicle.price}</p>
        {/* Add more fields as needed, conditionally for each type */}
        {type === "car" && vehicle.FuelType && <p>Fuel: {vehicle.FuelType}</p>}
        {type === "boat" && vehicle.Length && <p>Length: {vehicle.Length}m</p>}
        {type === "motorcycle" && vehicle.EngineCC && <p>Engine: {vehicle.EngineCC}cc</p>}
        {type === "bicycle" && vehicle.BikeType && <p>Bike Type: {vehicle.BikeType}</p>}
      </div>
      <div className="booking-section mt-4">
        <h4>Booking Details</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Pickup Date & Time</label>
            <input type="datetime-local" className="form-control" value={pickupDateTime} onChange={e => setPickupDateTime(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Dropoff Date & Time</label>
            <input type="datetime-local" className="form-control" value={dropoffDateTime} onChange={e => setDropoffDateTime(e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Pickup Location</label>
            <input type="text" className="form-control" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Dropoff Location</label>
            <input type="text" className="form-control" value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)} />
          </div>
        </div>
        {bookingError && <div className="alert alert-danger">{bookingError}</div>}
        <button className="btn btn-primary mt-2" onClick={handleGoToPayment} disabled={bookingLoading || !pickupDateTime || !dropoffDateTime || !pickupLocation || !dropoffLocation}>
          {bookingLoading ? "Processing..." : "Go to Payment"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleDetails;
