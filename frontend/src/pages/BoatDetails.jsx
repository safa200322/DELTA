import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import boatData from "../assets/data/boatData";
import Footer from "../components/Footer/Footer";
import "../styles/boat-details.css";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { name: "Select vehicle", label: "Select boat", active: currentStep >= 1 },
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

const BoatDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const singleBoatItem = boatData.find((item) => item.carName === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleBoatItem]);

  if (!singleBoatItem) {
    return <h2>Boat not found</h2>;
  }

  const handleGoToPayment = () => {
    navigate("/payment", { state: { boatSlug: slug } });
  };

  const handleHistoryClick = () => {
    navigate("/timeline");
  };

  const handleReviewsClick = () => {
    navigate("/reviews");
  };

  // Mock pick-up and drop-off details
  const pickupDetails = {
    date: "2 May 2025, Friday, 11:00",
    location: "Larnaca Marina",
    address: "Larnaca Marina, Finikoudes Promenade, Larnaca, 6023",
    service: "Dockside pick-up",
    hours: "Friday 08:00 - 18:00",
    instructions:
      "A staff member will meet you at the marina dock with the boat keys and paperwork.",
  };

  const dropoffDetails = {
    date: "10 May 2025, Saturday, 11:00",
    location: "Larnaca Marina",
    address: "Larnaca Marina, Finikoudes Promenade, Larnaca, 6023",
    hours: "Saturday 08:00 - 18:00",
    instructions: "Return the boat to the designated dock and notify staff.",
  };

  const boatFeatures = {
    seats: singleBoatItem.seatType || "6 seats",
    length: singleBoatItem.length || "20 ft",
    engine: singleBoatItem.engine || "Outboard",
    navigation: singleBoatItem.gps || "GPS Navigation",
    type: singleBoatItem.automatic || "Motorboat",
  };

  const fuelPolicy = singleBoatItem.fuelPolicy || "Full to full";
  const additionalInfo = "Free cancellation up to 48 hours";
  const supplier = {
    logo: "https://via.placeholder.com/100x30?text=SeaVenture+Rentals",
    rating: "8.2",
    ratingText: "Very Good",
    rentalConditionsLink: "#",
  };

  return (
    <Helmet title={singleBoatItem.carName}>
      <section className="vehicle-details-section py-5">
        <Container>
          <StepIndicator currentStep={2} />

          <Row className="mb-4">
            <Col lg="6" className="mb-4 mb-lg-0">
              <div className="details-box p-4">
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
              <div className="details-box p-4">
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

          <Row className="mb-4">
            <Col lg="8" md="7">
              <div className="details-box p-4">
                <div className="d-flex align-items-center gap-4 mb-4">
                  <img
                    src={singleBoatItem.imgUrl}
                    alt={singleBoatItem.carName}
                    className="vehicle-image"
                  />
                  <div>
                    <h4 className="fw-bold">{singleBoatItem.carName}</h4>
                    <div className="d-flex align-items-center gap-3 text-muted">
                      <span>
                        <i className="ri-user-3-line"></i> {boatFeatures.seats}
                      </span>
                      <span>
                        <i className="ri-ruler-line"></i> {boatFeatures.length}
                      </span>
                      <span>
                        <i className="ri-settings-3-line"></i>{" "}
                        {boatFeatures.engine}
                      </span>
                      <span>
                        <i className="ri-map-pin-line"></i>{" "}
                        {boatFeatures.navigation}
                      </span>
                      <span>
                        <i className="ri-ship-line"></i> {boatFeatures.type}
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
                    <span>Pick-up location: Dockside</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 additional-detail">
                    <i className="ri-calendar-check-line text-primary"></i>
                    <span>{additionalInfo}</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg="4" md="5">
              <div className="details-box p-4 text-center">
                <h3 className="fw-bold text-primary mb-2">
                  ${singleBoatItem.price}.00
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

          <Row className="mb-4">
            <Col lg="7" md="7">
              <div className="car__info">
                <h2 className="section__title">{singleBoatItem.carName}</h2>
                <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
                  <div className="d-flex align-items-center gap-4">
                    <h6 className="rent__price fw-bold fs-4">
                      ${singleBoatItem.price}.00 / Day
                    </h6>
                    <span
                      className="d-flex align-items-center gap-2"
                      onClick={handleReviewsClick}
                      style={{ cursor: "pointer" }}
                    >
                      <span style={{ color: "#f9a826" }}>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                      </span>
                      ({singleBoatItem.rating} ratings)
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
                  {singleBoatItem.description}
                </p>
                <div
                  className="d-flex align-items-center mt-3"
                  style={{ columnGap: "4rem" }}
                >
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-roadster-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleBoatItem.model}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-settings-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleBoatItem.automatic}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-timer-flash-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleBoatItem.speed}
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
                    ></i>{" "}
                    {singleBoatItem.gps}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-wheelchair-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleBoatItem.seatType}
                  </span>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i
                      className="ri-building-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleBoatItem.brand}
                  </span>
                </div>
              </div>
            </Col>
            <Col lg="5" md="5">
              <div className="details-box p-4">
                <h6 className="fw-bold mb-3">Good choice</h6>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="ri-check-line text-success"></i>
                  <span>Competitive pricing for this boat type.</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="ri-check-line text-success"></i>
                  <span>Free cancellation up to 48 hours.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-check-line text-success"></i>
                  <span>Instant confirmation!</span>
                </div>
              </div>
            </Col>
          </Row>

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

          <Row>
            <Col lg="12">
              <div className="details-box p-4">
                <div className="supplier-info d-flex align-items-center gap-3">
                  <img
                    src={supplier.logo}
                    alt="Supplier Logo"
                    className="supplier-logo"
                  />
                  <span className="text-muted">
                    {supplier.rating}{" "}
                    <i className="ri-star-fill text-warning"></i>{" "}
                    {supplier.ratingText}
                  </span>
                  <a
                    href={supplier.rentalConditionsLink}
                    className="text-primary ms-3"
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

export default BoatDetails;
