import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Input, Label, Alert } from "reactstrap";
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

const accessoriesByType = {
  car: [
    { name: "GPS Navigation", icon: "ri-gps-line" },
    { name: "Child Seat (Infant)", icon: "ri-baby-carriage-line" },
    { name: "Child Seat (Toddler)", icon: "ri-parent-line" },
    { name: "Booster Seat", icon: "ri-child-line" },
    { name: "Additional Driver", icon: "ri-user-add-line" },
    { name: "Snow Chains", icon: "ri-snowy-line" },
  ],
  boat: [
    { name: "Life Jackets", icon: "ri-life-buoy-line" },
    { name: "Anchor", icon: "ri-anchor-line" },
    { name: "GPS", icon: "ri-gps-line" },
  ],
  motorcycle: [
    { name: "Helmet", icon: "ri-helmet-line" },
    { name: "Gloves", icon: "ri-hand-coin-line" },
    { name: "Jacket", icon: "ri-t-shirt-line" },
  ],
  bicycle: [
    { name: "Helmet", icon: "ri-helmet-line" },
    { name: "Lock", icon: "ri-lock-line" },
    { name: "Basket", icon: "ri-shopping-basket-line" },
  ],
};

const VehicleDetails = () => {
  const { slug, type } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
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
        let url;
        if (type === "car" || type === "boat") {
          url = `http://localhost:5000/api/vehicles/filter?type=${type}&slug=${slug}`;
        } else if (type === "motorcycle" || type === "bicycle") {
          url = `http://localhost:5000/api/vehicles/filter?type=${type}&vehicleId=${slug}`;
        } else {
          url = `http://localhost:5000/api/vehicles/filter?type=${type}&slug=${slug}`;
        }
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [vehicle]);

  const calculateDaysDifference = () => {
    if (pickupDateTime && dropoffDateTime) {
      const start = new Date(pickupDateTime);
      const end = new Date(dropoffDateTime);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };

  const getTotalPrice = () => {
    const dailyPrice = typeof vehicle?.Price === 'number' ? vehicle.Price : (vehicle?.price || 0);
    const days = calculateDaysDifference();
    return dailyPrice * days;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <h2>Vehicle not found</h2>
          <p>The vehicle you're looking for doesn't exist or has been removed.</p>
          <Button color="primary" onClick={() => navigate(`/${type}s`)}>
            Back to {type.charAt(0).toUpperCase() + type.slice(1)}s
          </Button>
        </div>
      </div>
    );
  }

  // Dynamic fields for each type
  const vehicleFields = {
    car: [
      { label: "Fuel", value: vehicle.FuelType },
      { label: "Seats", value: vehicle.Seats },
      { label: "Transmission", value: vehicle.Transmission },
      { label: "Color", value: vehicle.Color },
      { label: "Year", value: vehicle.Year },
    ],
    boat: [
      { label: "Length", value: vehicle.Length },
      { label: "Capacity", value: vehicle.Capacity },
      { label: "Engine Type", value: vehicle.EngineType },
    ],
    motorcycle: [
      { label: "Engine", value: vehicle.EngineCC },
      { label: "Type", value: vehicle.Type },
      { label: "Color", value: vehicle.Color },
    ],
    bicycle: [
      { label: "Bike Type", value: vehicle.BikeType },
      { label: "Frame", value: vehicle.frame_material },
      { label: "Wheel Size", value: vehicle.wheel_size },
    ],
  };

  const accessories = accessoriesByType[type] || [];

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

  return (
    <Helmet title={`${type.charAt(0).toUpperCase() + type.slice(1)} Details`}>
      <section className="vehicle-details-section py-5">
        <Container>
          <StepIndicator currentStep={2} />
          <Row className="mb-4 align-items-stretch">
            <Col lg="6" className="mb-4 mb-lg-0">
              <div className="details-box p-4 h-100">
                <h6 className="fw-bold text-uppercase text-muted mb-3">
                  <i className="ri-calendar-line me-2"></i>Pick-up Details
                </h6>
                <Row className="mb-3">
                  <Col md="12">
                    <Label for="pickupDateTime" className="form-label fw-semibold">Pick-up Date & Time</Label>
                    <Input
                      type="datetime-local"
                      id="pickupDateTime"
                      value={pickupDateTime}
                      onChange={e => setPickupDateTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="form-control"
                    />
                  </Col>
                </Row>
                <div className="mb-3">
                  <Label className="form-label fw-semibold">Pick-up Location</Label>
                  <div className="d-flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter or select location"
                      value={pickupLocation}
                      onChange={e => setPickupLocation(e.target.value)}
                      className="form-control"
                    />
                    <Button color="outline-primary" size="sm" onClick={() => { setLocationModalType('pickup'); setIsLocationModalOpen(true); }} title="Select on map">
                      <i className="ri-map-pin-2-line"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="details-box p-4 h-100">
                <h6 className="fw-bold text-uppercase text-muted mb-3">
                  <i className="ri-calendar-check-line me-2"></i>Drop-off Details
                </h6>
                <Row className="mb-3">
                  <Col md="12">
                    <Label for="dropoffDateTime" className="form-label fw-semibold">Drop-off Date & Time</Label>
                    <Input
                      type="datetime-local"
                      id="dropoffDateTime"
                      value={dropoffDateTime}
                      onChange={e => setDropoffDateTime(e.target.value)}
                      min={pickupDateTime || new Date().toISOString().slice(0, 16)}
                      className="form-control"
                    />
                  </Col>
                </Row>
                <div className="mb-3">
                  <Label className="form-label fw-semibold">Drop-off Location</Label>
                  <div className="d-flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter or select location"
                      value={dropoffLocation}
                      onChange={e => setDropoffLocation(e.target.value)}
                      className="form-control"
                    />
                    <Button color="outline-primary" size="sm" onClick={() => { setLocationModalType('dropoff'); setIsLocationModalOpen(true); }} title="Select on map">
                      <i className="ri-map-pin-2-line"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col lg="6">
              <img
                src={vehicle.VehiclePic || vehicle.imgUrl || vehicle.image_url || "https://via.placeholder.com/500x300?text=No+Image"}
                alt={vehicle.model || vehicle.name || vehicle.Model || 'Vehicle'}
                className="w-100"
              />
            </Col>
            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title">{vehicle.model || vehicle.name || vehicle.Model || 'Vehicle'}</h2>
                <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
                  <div className="d-flex align-items-center gap-4">
                    <h6 className="rent__price fw-bold fs-4">
                      ${typeof vehicle.Price === 'number' ? vehicle.Price : (vehicle.price || 0)}.00 / Day
                    </h6>
                  </div>
                </div>
                <p className="section__description">
                  {vehicle.description}
                </p>
                <div className="d-flex align-items-center mt-3" style={{ columnGap: "4rem" }}>
                  {vehicleFields[type]?.map((field, idx) => field.value && (
                    <span key={idx} className="d-flex align-items-center gap-1 section__description">
                      <i className="ri-information-line" style={{ color: "#f9a826" }}></i>
                      {field.label}: {field.value}
                    </span>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mb-4 align-items-stretch">
            <Col lg="8" md="7">
              <div className="details-box p-4 h-100">
                <div className="d-flex align-items-center gap-4 mb-4">
                  <img
                    src={vehicle.VehiclePic || vehicle.imgUrl || vehicle.image_url || "https://via.placeholder.com/150x100?text=No+Image"}
                    alt={vehicle.model || vehicle.name || vehicle.Model || 'Vehicle'}
                    className="vehicle-image"
                    style={{ maxWidth: "150px", height: "auto" }}
                  />
                  <div>
                    <h4 className="fw-bold">{vehicle.model || vehicle.name || vehicle.Model || 'Vehicle'}</h4>
                    <div className="d-flex align-items-center gap-3 text-muted flex-wrap">
                      {vehicleFields[type]?.map((field, idx) => field.value && (
                        <span key={idx}><i className="ri-checkbox-circle-line"></i> {field.label}: {field.value}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
                  <div className="d-flex align-items-center gap-2 additional-detail">
                    <i className="ri-calendar-check-line text-primary"></i>
                    <span>Unlimited free cancellation</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="4" md="5">
              <div className="details-box p-4 h-100 d-flex flex-column justify-content-center align-items-center">
                <div className="text-center">
                  <h3 className="fw-bold text-primary mb-1">
                    ${typeof vehicle.Price === 'number' ? vehicle.Price : (vehicle.price || 0)}.00/day
                  </h3>
                  {pickupDateTime && dropoffDateTime && (
                    <>
                      <p className="text-muted mb-1">{calculateDaysDifference()} day(s)</p>
                      <h4 className="fw-bold text-success mb-2">
                        Total: ${getTotalPrice()}.00
                      </h4>
                    </>
                  )}
                  <p className="text-muted mb-3">
                    {pickupDateTime && dropoffDateTime ? 'Total cost' : 'Daily rate'}
                  </p>
                </div>
                <Button
                  color="primary"
                  onClick={handleGoToPayment}
                  className="go-to-payment-button w-100"
                  disabled={!pickupDateTime || !dropoffDateTime || !pickupLocation || !dropoffLocation || !user}
                >
                  {!user ? 'Loading user information...' :
                    (!pickupDateTime || !dropoffDateTime || !pickupLocation || !dropoffLocation
                      ? 'Complete booking details'
                      : 'Go to Payment')
                  }
                </Button>
                {(!pickupDateTime || !dropoffDateTime || !pickupLocation || !dropoffLocation) && user && (
                  <small className="text-muted mt-2 text-center">
                    Please select dates and locations to proceed
                  </small>
                )}
                {bookingError && <Alert color="danger" className="mt-2">{bookingError}</Alert>}
              </div>
            </Col>
          </Row>
          {/* Accessories Section */}
          <Row className="mb-4">
            <Col lg="12">
              <div className="details-box p-4">
                <h5 className="fw-bold mb-3">Accessories</h5>
                <div className="d-flex flex-wrap gap-3">
                  {accessories.map((accessory, index) => (
                    <div key={index} className="d-flex align-items-center gap-2">
                      <i className={`${accessory.icon} text-primary`}></i>
                      <span>{accessory.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
          {/* Payment Section */}
          <Row className="mb-4">
            <Col lg="7" md="7">
              <div className="booking-info mt-5">
                <h5 className="mb-4 fw-bold">Booking Information</h5>
                {user ? (
                  <div className="user-profile-summary">
                    <Row className="mb-3">
                      <Col md="6">
                        <Label className="form-label fw-semibold">Full Name</Label>
                        <Input type="text" value={user.fullName} disabled className="form-control bg-light" />
                      </Col>
                      <Col md="6">
                        <Label className="form-label fw-semibold">Email</Label>
                        <Input type="email" value={user.email} disabled className="form-control bg-light" />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="6">
                        <Label className="form-label fw-semibold">Phone Number</Label>
                        <Input type="text" value={user.phone} disabled className="form-control bg-light" />
                      </Col>
                      <Col md="6">
                        <Label className="form-label fw-semibold">Address</Label>
                        <Input type="text" value={user.address} disabled className="form-control bg-light" />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="6">
                        <Label className="form-label fw-semibold">Driver's License</Label>
                        <Input type="text" value={user.driversLicense} disabled className="form-control bg-light" />
                      </Col>
                      <Col md="6">
                        <Label className="form-label fw-semibold">Date of Birth</Label>
                        <Input type="text" value={user.dateOfBirth} disabled className="form-control bg-light" />
                      </Col>
                    </Row>
                    <div className="alert alert-info d-flex align-items-center mt-3">
                      <i className="ri-information-line me-2 fs-5"></i>
                      <div>
                        This information is from your profile. To update your details, please visit your
                        <Button color="link" className="p-0 ms-1" onClick={() => navigate('/profile')}>profile page</Button>.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading user data...</span>
                    </div>
                    <p className="mt-2">Loading your information...</p>
                  </div>
                )}
              </div>
            </Col>
            <Col lg="5" md="5">
              <div className="payment__info mt-5">
                <h5 className="mb-4 fw-bold">Payment Information</h5>
                <PaymentMethod />
              </div>
            </Col>
          </Row>
        </Container>
        <LocationPickerModal
          isOpen={isLocationModalOpen}
          toggle={() => setIsLocationModalOpen(false)}
          onLocationSelect={selectedAddress => {
            if (locationModalType === 'pickup') setPickupLocation(selectedAddress);
            else setDropoffLocation(selectedAddress);
            setIsLocationModalOpen(false);
          }}
          title={`Select ${locationModalType === 'pickup' ? 'Pick-up' : 'Drop-off'} Location`}
        />
        <Footer />
      </section>
    </Helmet>
  );
};

export default VehicleDetails;
