import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Input, Label, Alert } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import PaymentMethod from "../components/UI/PaymentMethod";
import LocationPickerModal from "../components/UI/LocationPickerModal";
import carData from "../assets/data/carData";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";
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

  const progressWidth =
    steps.length <= 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="step-indicator mb-5">
      <div className="progress-bar-container">
        <div className="progress-bar-background"></div>
        <div
          className="progress-bar"
          style={{ width: `${progressWidth}%` }}
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

const CarDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = window.location.state || {};
  const [singleCarItem, setSingleCarItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // To store any errors

  // Check if user is logged in
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", {
            state: {
              redirectTo: `/cars/${slug}`,
              message: "Please log in to view vehicle details and make bookings.",
            },
          });
          return;
        }

        // Fetch user data from the backend
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If token is invalid or expired
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token"); // Clear invalid token
            navigate("/login", {
              state: {
                redirectTo: `/cars/${slug}`,
                message: "Your session has expired. Please log in again.",
              },
            });
          }
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Authentication or user fetch failed:", err);
        setError(err.message);
        // Optional: redirect to login on any fetch error
        navigate("/login", {
          state: {
            redirectTo: `/cars/${slug}`,
            message: "Could not retrieve your profile. Please log in again.",
          },
        });
      }
    };

    checkAuthAndFetchUser();
  }, [navigate, slug]);

  // Debug navigation state received
  useEffect(() => {
    console.debug("[CarDetails] Received navigation state:", location);
  }, [location]);

  // Booking state
  const [pickupDateTime, setPickupDateTime] = useState(
    location.pickupDateTime || localStorage.getItem("pickupDateTime") || ''
  );
  const [dropoffDateTime, setDropoffDateTime] = useState(
    location.dropoffDateTime || localStorage.getItem("dropoffDateTime") || ''
  );
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  // Location picker modal state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationModalType, setLocationModalType] = useState('pickup'); // 'pickup' or 'dropoff'

  // Check if slug is a number (ID) or a string (name)
  const isId = !isNaN(slug) && !isNaN(parseFloat(slug));

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/vehicles/filter";

        if (isId) {
          // If it's an ID, use the vehicleId filter
          url += `?vehicleId=${slug}`;
        } else {
          // If it's a name, try to find by model (fallback to static data)
          const staticCar = carData.find((item) => item.carName === slug);
          setSingleCarItem(staticCar);
          setLoading(false);
          return;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSingleCarItem(data[0]); // Take the first result
          } else {
            setSingleCarItem(null);
          }
        } else {
          setSingleCarItem(null);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setSingleCarItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [slug, isId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleCarItem]);

  useEffect(() => {
    // If navigation state has pre-filled datetimes, set them and update localStorage (only on mount)
    if (location.pickupDateTime) {
      setPickupDateTime(location.pickupDateTime);
      localStorage.setItem("pickupDateTime", location.pickupDateTime);
    }
    if (location.dropoffDateTime) {
      setDropoffDateTime(location.dropoffDateTime);
      localStorage.setItem("dropoffDateTime", location.dropoffDateTime);
    }
  }, []);

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

  if (!singleCarItem) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <h2>Vehicle not found</h2>
          <p>The vehicle you're looking for doesn't exist or has been removed.</p>
          <Button color="primary" onClick={() => navigate('/cars')}>
            Back to Cars
          </Button>
        </div>
      </div>
    );
  }

  const handleGoToPayment = () => {
    navigate("/payment", { state: { carSlug: slug } });
  };

  const handleHistoryClick = () => {
    navigate("/timeline");
  };

  const handleReviewsClick = () => {
    navigate("/reviews");
  };

  const openLocationPicker = (type) => {
    console.log('openLocationPicker called with type:', type);
    setLocationModalType(type);
    setIsLocationModalOpen(true);
    console.log('Modal state set to open, type:', type);
  };

  const handleLocationSelect = (selectedAddress) => {
    console.log('Location selected:', selectedAddress, 'for type:', locationModalType);
    if (locationModalType === 'pickup') {
      setPickupLocation(selectedAddress);
    } else {
      setDropoffLocation(selectedAddress);
    }
    setIsLocationModalOpen(false);
  };

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
    const dailyPrice = typeof singleCarItem.Price === 'number' ? singleCarItem.Price : (singleCarItem.price || 0);
    const days = calculateDaysDifference();
    return dailyPrice * days;
  };

  const carFeatures = {
    seats: singleCarItem.Seats || singleCarItem.seatType || "5 seats",
    bags: singleCarItem.bags || "2 bags",
    doors: singleCarItem.doors || "5 doors",
    airConditioning: singleCarItem.airConditioning === true ? "Air Conditioning" : "",
    transmission: singleCarItem.Transmission || singleCarItem.automatic || "Automatic",
  };

  const fuelPolicy = singleCarItem.fuelPolicy || "Same to same";
  const pickupLocationDetail = pickupLocation || "Location to be selected";
  const additionalInfo = "Unlimited free cancellation";

  const supplier = {
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='30' viewBox='0 0 100 30'%3E%3Crect width='100' height='30' fill='%23007bff'/%3E%3Ctext x='50' y='20' text-anchor='middle' fill='white' font-size='8' font-family='Arial'%3EStreet Rent a Car%3C/text%3E%3C/svg%3E",
    rating: "7.4",
    ratingText: "Average",
    rentalConditionsLink: "#",
  };

  const carAccessories = [
    { name: "GPS Navigation", icon: "ri-gps-line" },
    { name: "Child Seat (Infant)", icon: "ri-baby-carriage-line" },
    { name: "Child Seat (Toddler)", icon: "ri-parent-line" },
    { name: "Booster Seat", icon: "ri-child-line" },
    { name: "Additional Driver", icon: "ri-user-add-line" },
    { name: "Snow Chains", icon: "ri-snowy-line" },
  ];

  return (
    <Helmet title={singleCarItem.carName || singleCarItem.Model || 'Vehicle Details'}>
      <section className="vehicle-details-section py-5">
        <Container>
          <StepIndicator currentStep={2} />

          {/* Booking Details Section */}
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
                      onChange={(e) => {
                        setPickupDateTime(e.target.value);
                        localStorage.setItem("pickupDateTime", e.target.value);
                      }}
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
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="form-control"
                    />
                    <Button
                      color="outline-primary"
                      size="sm"
                      onClick={() => openLocationPicker('pickup')}
                      title="Select on map"
                    >
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
                      onChange={(e) => {
                        setDropoffDateTime(e.target.value);
                        localStorage.setItem("dropoffDateTime", e.target.value);
                      }}
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
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="form-control"
                    />
                    <Button
                      color="outline-primary"
                      size="sm"
                      onClick={() => openLocationPicker('dropoff')}
                      title="Select on map"
                    >
                      <i className="ri-map-pin-2-line"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Car Image and Info */}
          <Row className="mb-4">
            <Col lg="6">
              <img
                src={singleCarItem.vehiclepic || singleCarItem.imgUrl || "https://via.placeholder.com/500x300?text=No+Image"}
                alt={singleCarItem.carName || singleCarItem.Model || 'Vehicle'}
                className="w-100"
              />
            </Col>
            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title">{singleCarItem.carName || singleCarItem.Model || 'Vehicle'}</h2>
                <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
                  <div className="d-flex align-items-center gap-4">
                    <h6 className="rent__price fw-bold fs-4">
                      ${typeof singleCarItem.Price === 'number' ? singleCarItem.Price : (singleCarItem.price || 0)}.00 / Day
                    </h6>
                    <span
                      className="d-flex align-items-center gap-2"
                      onClick={handleReviewsClick}
                      style={{ cursor: "pointer" }}
                    >
                      <span style={{ color: "#f9a826" }}>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="ri-star-s-fill"></i>
                        ))}
                      </span>
                      ({singleCarItem.rating || "4.5"} ratings)
                    </span>
                  </div>
                  <Button
                    color="primary"
                    onClick={handleHistoryClick}
                    style={{ backgroundColor: "#000d6b", color: "#fff" }}
                  >
                    History
                  </Button>
                </div>
                <p className="section__description">
                  {singleCarItem.description}
                </p>
                <div
                  className="d-flex align-items-center mt-3"
                  style={{ columnGap: "4rem" }}
                >
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-roadster-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.Model || singleCarItem.model || 'Model'}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-settings-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.Transmission || singleCarItem.automatic || 'Automatic'}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-timer-flash-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.speed || "220 km/h"}
                  </span>
                </div>
                <div
                  className="d-flex align-items-center mt-3"
                  style={{ columnGap: "2.8rem" }}
                >
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-map-pin-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.gps}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-wheelchair-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.seatType}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-building-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.Brand || singleCarItem.brand || 'Brand'}
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Car Details and Price */}
          <Row className="mb-4 align-items-stretch">
            <Col lg="8" md="7">
              <div className="details-box p-4 h-100">
                <div className="d-flex align-items-center gap-4 mb-4">
                  <img
                    src={singleCarItem.vehiclepic || singleCarItem.imgUrl || "https://via.placeholder.com/150x100?text=No+Image"}
                    alt={singleCarItem.carName || singleCarItem.Model || 'Vehicle'}
                    className="vehicle-image"
                    style={{ maxWidth: "150px", height: "auto" }}
                  />
                  <div>
                    <h4 className="fw-bold">{singleCarItem.carName || singleCarItem.Model || 'Vehicle'}</h4>
                    <div className="d-flex align-items-center gap-3 text-muted flex-wrap">
                      <span>
                        <i className="ri-user-3-line"></i> {carFeatures.seats}
                      </span>
                      <span>
                        <i className="ri-briefcase-line"></i> {carFeatures.bags}
                      </span>
                      <span>
                        <i className="ri-door-open-line"></i>{" "}
                        {carFeatures.doors}
                      </span>
                      {carFeatures.airConditioning && (
                        <span>
                          <i className="ri-snowy-line"></i>{" "}
                          {carFeatures.airConditioning}
                        </span>
                      )}
                      <span>
                        <i className="ri-settings-3-line"></i>{" "}
                        {carFeatures.transmission}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
                  <div className="d-flex align-items-center gap-2 additional-detail">
                    <i className="ri-gas-station-line text-primary"></i>
                    <span>Fuel policy: {fuelPolicy}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 additional-detail">
                    <i className="ri-map-pin-2-line text-primary"></i>
                    <span>Pick-up location: {pickupLocationDetail}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 additional-detail">
                    <i className="ri-calendar-check-line text-primary"></i>
                    <span>{additionalInfo}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="4" md="5">
              <div className="details-box p-4 h-100 d-flex flex-column justify-content-center align-items-center">
                <div className="text-center">
                  <h3 className="fw-bold text-primary mb-1">
                    ${typeof singleCarItem.Price === 'number' ? singleCarItem.Price : (singleCarItem.price || 0)}.00/day
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
              </div>
            </Col>
          </Row>

          {/* Accessories Section */}
          <Row className="mb-4">
            <Col lg="12">
              <div className="details-box p-4">
                <h5 className="fw-bold mb-3">Accessories</h5>
                <div className="d-flex flex-wrap gap-3">
                  {carAccessories.map((accessory, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className={`${accessory.icon} text-primary`}></i>
                      <span>{accessory.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          {/* Additional Inclusions and Good Choice */}
          <Row className="mb-4 align-items-stretch">
            <Col lg="8" md="7">
              <div className="details-box p-4 h-100">
                <div className="features d-flex align-items-center gap-5 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-check-line text-success"></i>
                    <span>Unlimited mileage</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-check-line text-success"></i>
                    <span>Collision Damage Waiver</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-check-line text-success"></i>
                    <span>Theft Protection</span>
                  </div>
                  <span className="text-primary">FULL PREPAYMENT</span>
                </div>
              </div>
            </Col>
            <Col lg="4" md="5">
              <div className="details-box p-4 h-100">
                <h6 className="fw-bold mb-3">Good choice</h6>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="ri-check-line text-success"></i>
                  <span>
                    56% lower price than the average for a Compact car.
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="ri-check-line text-success"></i>
                  <span>Complete freedom with unlimited mileage</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line text-success"></i>
                  <span>Instant confirmation!</span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Booking and Payment Sections */}
          <Row className="mb-4">
            <Col lg="7" md="7">
              <div className="booking-info mt-5">
                <h5 className="mb-4 fw-bold">Booking Information</h5>
                {user ? (
                  <div className="user-profile-summary">
                    <Row className="mb-3">
                      <Col md="6">
                        <Label className="form-label fw-semibold">Full Name</Label>
                        <Input
                          type="text"
                          value={user.fullName}
                          disabled
                          className="form-control bg-light"
                        />
                      </Col>
                      <Col md="6">
                        <Label className="form-label fw-semibold">Email</Label>
                        <Input
                          type="email"
                          value={user.email}
                          disabled
                          className="form-control bg-light"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="6">
                        <Label className="form-label fw-semibold">Phone Number</Label>
                        <Input
                          type="text"
                          value={user.phone}
                          disabled
                          className="form-control bg-light"
                        />
                      </Col>
                      <Col md="6">
                        <Label className="form-label fw-semibold">Address</Label>
                        <Input
                          type="text"
                          value={user.address}
                          disabled
                          className="form-control bg-light"
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md="6">
                        <Label className="form-label fw-semibold">Driver's License</Label>
                        <Input
                          type="text"
                          value={user.driversLicense}
                          disabled
                          className="form-control bg-light"
                        />
                      </Col>
                      <Col md="6">
                        <Label className="form-label fw-semibold">Date of Birth</Label>
                        <Input
                          type="text"
                          value={user.dateOfBirth}
                          disabled
                          className="form-control bg-light"
                        />
                      </Col>
                    </Row>
                    <div className="alert alert-info d-flex align-items-center mt-3">
                      <i className="ri-information-line me-2 fs-5"></i>
                      <div>
                        This information is from your profile. To update your details, please visit your
                        <Button
                          color="link"
                          className="p-0 ms-1"
                          onClick={() => navigate('/profile')}
                        >
                          profile page
                        </Button>.
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

          {/* Supplier Info */}
          <Row>
            <Col lg="12">
              <div className="details-box p-4">
                <div className="supplier-info d-flex align-items-center gap-3 flex-wrap">
                  <img
                    src={supplier.logo}
                    alt="Supplier Logo"
                    className="supplier-logo"
                    style={{ maxWidth: "100px", height: "auto" }}
                  />
                  <span className="text-muted">
                    {supplier.rating}{" "}
                    <i className="ri-star-fill text-warning"></i>{" "}
                    {supplier.ratingText}
                  </span>
                  <a
                    href={supplier.rentalConditionsLink}
                    className="text-primary ms-lg-3"
                  >
                    Rental Conditions
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        toggle={() => {
          console.log('Modal toggle called');
          setIsLocationModalOpen(false);
        }}
        onLocationSelect={handleLocationSelect}
        title={`Select ${locationModalType === 'pickup' ? 'Pick-up' : 'Drop-off'} Location`}
      />

      <Footer />
    </Helmet>
  );
};

export default CarDetails;
