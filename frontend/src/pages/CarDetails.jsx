import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
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
  const singleCarItem = carData.find((item) => item.carName === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleCarItem]);

  if (!singleCarItem) {
    return <h2>Vehicle not found</h2>;
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

  const pickupDetails = {
    date: "2 May 2025, Friday, 11:00",
    location: "Larnaca Airport (LCA)",
    address:
      "Larnaca International Airport, Ezekia Papaioannou Str, Dromolaxia, Larnaca, 7020",
    service: "Free shuttle service",
    hours: "Friday 08:00 - 20:00",
    instructions:
      "When the flight lands in Larnaca, a member of our staff will wait for you at the arrivals hall with a sign with your name.",
  };

  const dropoffDetails = {
    date: "10 May 2025, Saturday, 11:00",
    location: "Larnaca Airport (LCA)",
    address:
      "Larnaca International Airport, Ezekia Papaioannou Str, Dromolaxia, Larnaca, 7020",
    hours: "Saturday 08:00 - 20:00",
    instructions:
      "Please clarify drop-off instructions with the supplier upon pick-up.",
  };

  const carFeatures = {
    seats: singleCarItem.seatType || "5 seats",
    bags: singleCarItem.bags || "2 bags",
    doors: singleCarItem.doors || "5 doors",
    airConditioning:
      singleCarItem.airConditioning === true ? "Air Conditioning" : "",
    transmission: singleCarItem.automatic || "Automatic",
  };

  const fuelPolicy = singleCarItem.fuelPolicy || "Same to same";
  const pickupLocationDetail =
    singleCarItem.pickupLocationDetail || "Free shuttle service";
  const additionalInfo = "Unlimited free cancellation";

  const supplier = {
    logo: "https://via.placeholder.com/100x30?text=Street+Rent+a+Car",
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
    <Helmet title={singleCarItem.carName}>
      <section className="vehicle-details-section py-5">
        <Container>
          <StepIndicator currentStep={2} />

          {/* Pick-up and Drop-off Sections */}
          <Row className="mb-4 align-items-stretch">
            <Col lg="6" className="mb-4 mb-lg-0">
              <div className="details-box p-4 h-100">
                <h6 className="fw-bold text-uppercase text-muted mb-3">
                  Pick-up
                </h6>
                <h5 className="fw-bold mb-2">{pickupDetails.date}</h5>
                <p className="text-muted mb-2">
                  {pickupDetails.location} <br />
                  Address: {pickupDetails.address}
                </p>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="ri-map-pin-2-line text-primary"></i>
                  <span>{pickupDetails.service}</span>
                </div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="ri-time-line text-primary"></i>
                  <span>{pickupDetails.hours}</span>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <i className="ri-information-line text-primary"></i>
                  <span>{pickupDetails.instructions}</span>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="details-box p-4 h-100">
                <h6 className="fw-bold text-uppercase text-muted mb-3">
                  Drop-off
                </h6>
                <h5 className="fw-bold mb-2">{dropoffDetails.date}</h5>
                <p className="text-muted mb-2">
                  {dropoffDetails.location} <br />
                  Address: {dropoffDetails.address}
                </p>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="ri-time-line text-primary"></i>
                  <span>{dropoffDetails.hours}</span>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <i className="ri-information-line text-primary"></i>
                  <span>{dropoffDetails.instructions}</span>
                </div>
                <Button color="link" className="p-0 mt-2 text-primary">
                  Show on map
                </Button>
              </div>
            </Col>
          </Row>

          {/* Car Image and Info */}
          <Row className="mb-4">
            <Col lg="6">
              <img
                src={singleCarItem.imgUrl}
                alt={singleCarItem.carName}
                className="w-100"
              />
            </Col>
            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title">{singleCarItem.carName}</h2>
                <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
                  <div className="d-flex align-items-center gap-4">
                    <h6 className="rent__price fw-bold fs-4">
                      £{singleCarItem.price}.00 / Day
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
                      ({singleCarItem.rating} ratings)
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
                    {singleCarItem.model}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-settings-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.automatic}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-timer-flash-line"
                      style={{ color: "#f9a826" }}
                    ></i>
                    {singleCarItem.speed}
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
                    {singleCarItem.brand}
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
                    src={singleCarItem.imgUrl}
                    alt={singleCarItem.carName}
                    className="vehicle-image"
                    style={{ maxWidth: "150px", height: "auto" }}
                  />
                  <div>
                    <h4 className="fw-bold">{singleCarItem.carName}</h4>
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
                <h3 className="fw-bold text-primary mb-2">
                  £{singleCarItem.price}.00
                </h3>
                <p className="text-muted mb-3">Cost of rental</p>
                <Button
                  color="primary"
                  onClick={handleGoToPayment}
                  className="go-to-payment-button"
                >
                  Go to Payment
                </Button>
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
                <BookingForm />
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
      <Footer />
    </Helmet>
  );
};

export default CarDetails;
