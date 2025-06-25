import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { label: "Select vehicle", active: currentStep >= 1 },
    { label: "Booking details", active: currentStep >= 2 },
    { label: "Extra Services", active: currentStep >= 3 },
    { label: "Secure payment", active: currentStep >= 4 },
    { label: "Confirmation", active: currentStep >= 5 },
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

const CarDetails = () => {
  const { slug } = useParams();
  const slugId = slug.match(/\d+$/)?.[0];
  console.log("Full slug:", slug);
  console.log("Extracted ID:", slugId);

  useEffect(() => {
    console.log("DEBUG: slug from URL params is:", slug);
  }, [slug]);

  const navigate = useNavigate();

  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationId, setReservationId] = useState(null);

  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://localhost:443/api/slug/element/${slug}`);
        if (!response.ok) throw new Error("Vehicle not found");
        const data = await response.json();
        setCarData(data);
        setPickupAddress(data.pickupDetails?.address || "");
        setDropoffAddress(data.dropoffDetails?.address || "");
      } catch (err) {
        setError(err.message || "Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [slug]);

  const openGoogleMapsSearch = (address) => {
    const query = encodeURIComponent(address || "");
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleSaveAddress = async (type, address) => {
    try {
      const userID = localStorage.getItem("userId");
      if (!userID) return alert("User not logged in");
      if (!address) return alert("Address is required");
      if (!startDate) return alert("Please select a start date");
      if (type === "dropoff" && !endDate) return alert("Please select an end date");

      const response = await fetch("https://localhost:443/api/location/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          type,
          slug: slugId,
          startDate,
          endDate,
          UserID: userID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save address");
      }

      const data = await response.json();

      if (type === "pickup") {
        setReservationId(data.id);
      }

      alert(`${type === "pickup" ? "Pickup" : "Dropoff"} address saved successfully!`);
    } catch (err) {
      alert(`Error saving ${type} address: ${err.message}`);
    }
  };

  const handleGoToExtraServices = () => {
    navigate("/Extra", {
      state: {
        carSlug: slugId,
        pickupAddress,
        dropoffAddress,
        chauffeur: carData?.Chauffeur === 1 ? "Available" : "Not available",
        startDate,
        endDate,
        price: carData?.Price,
        reservationId,
      },
    });
  };

  const handleBackToListing = () => navigate("/cars");
  const handleHistoryClick = () => navigate("/timeline");
  const handleReviewsClick = () => navigate("/reviews");

  if (loading) return <h2>Loading vehicle details...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!carData) return <h2>Vehicle not found</h2>;

  const {
    Brand,
    CarName,
    Price,
    Image,
    Description,
    Chauffeur,
    Location,
    Speed,
    Model,
    pickupDetails = {},
    dropoffDetails = {},
  } = carData;

  const carName = CarName || Brand || "Unknown";
  const imgUrl = Image?.startsWith("http") ? Image : `https://localhost:443/public/${Image}`;
  const chauffeur = Chauffeur === 1 ? "Available" : "Not available";

  return (
    <Helmet title={carName}>
      <section className="vehicle-details-section py-5">
        <Container>
          <Button
            color="secondary"
            className="mb-3"
            onClick={handleBackToListing}
            style={{ backgroundColor: "#6c757d", border: "none" }}
          >
            &larr; Back to listing
          </Button>

          <StepIndicator currentStep={2} />

          <Row className="mb-4">
            <Col lg="6" className="mb-4 mb-lg-0">
              <div className="details-box p-4 h-100">
                <h6 className="fw-bold text-uppercase text-muted mb-3">Pick-up</h6>
                <input
                  type="text"
                  id="pickupAddress"
                  className="form-control mb-2"
                  placeholder={pickupDetails?.address || "Enter pickup address"}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
                <div className="d-flex gap-2 mb-3">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => openGoogleMapsSearch(pickupAddress)}>
                    Select Pickup on Google Maps
                  </button>
                  <button className="btn btn-outline-success btn-sm" onClick={() => handleSaveAddress("pickup", pickupAddress)}>
                    Save Pickup
                  </button>
                </div>
              </div>
            </Col>

            <Col lg="6">
              <div className="details-box p-4 h-100">
                <h6 className="fw-bold text-uppercase text-muted mb-3">Drop-off</h6>
                <input
                  type="text"
                  id="dropoffAddress"
                  className="form-control mb-2"
                  placeholder={dropoffDetails?.address || "Enter dropoff address"}
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                />
                <div className="d-flex gap-2 mb-3">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => openGoogleMapsSearch(dropoffAddress)}>
                    Select Dropoff on Google Maps
                  </button>
                  <button className="btn btn-outline-success btn-sm" onClick={() => handleSaveAddress("dropoff", dropoffAddress)}>
                    Save Dropoff
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg="6" className="mb-4 mb-lg-0">
              <div className="details-box p-4 h-100">
                <label htmlFor="startDate" className="form-label fw-medium">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </Col>

            <Col lg="6">
              <div className="details-box p-4 h-100">
                <label htmlFor="endDate" className="form-label fw-medium">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => {
                    const selectedEndDate = new Date(e.target.value);
                    const selectedStartDate = new Date(startDate);
                    const maxAllowedEndDate = new Date(selectedStartDate);
                    maxAllowedEndDate.setDate(selectedStartDate.getDate() + 5);

                    if (startDate && selectedEndDate > maxAllowedEndDate) {
                      alert("Drop-off date cannot be more than 5 days after pickup date.");
                      return;
                    }

                    setEndDate(e.target.value);
                  }}
                />
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg="6">
              <img src={imgUrl} alt={carName} className="w-100" />
            </Col>
            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title">{carName}</h2>
                <h6 className="section__title">*Chauffeur is {chauffeur}*</h6>
                <p className="section__description mb-4">{Description || "No description available."}</p>
                <h6 className="section__title">Price: ${Price} / day</h6>
                <Button color="primary" size="lg" className="mt-3" onClick={handleGoToExtraServices}>
                  Next Step
                </Button>
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-between">
            <Button color="secondary" onClick={handleHistoryClick}>
              History
            </Button>
            <Button color="secondary" onClick={handleReviewsClick}>
              Reviews
            </Button>
          </div>
        </Container>
      </section>
      <Footer />
    </Helmet>
  );
};

export default CarDetails;
