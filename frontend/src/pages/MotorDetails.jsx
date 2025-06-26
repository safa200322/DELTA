import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import motorData from "../assets/data/motorData";
import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import Footer from "../components/Footer/Footer";

const MotorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Replace motorData.find with id lookup
  const singleMotorItem = motorData.find((item) => String(item.VehicleID) === String(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleMotorItem]);

  const handleHistoryClick = () => {
    navigate("/timeline");
  };

  const handleReviewsClick = () => {
    navigate("/reviews");
  };

  return (
    <Helmet title={singleMotorItem?.carName || 'Motor Details'}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img src={singleMotorItem?.imgUrl} alt="" className="w-100" />
            </Col>

            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title">{singleMotorItem?.carName}</h2>

                {/* PRICE + RATING + HISTORY BUTTON */}
                <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
                  <div className="d-flex align-items-center gap-4">
                    <h6 className="rent__price fw-bold fs-4">${singleMotorItem?.price}.00 / Day</h6>

                    <span className="d-flex align-items-center gap-2" onClick={handleReviewsClick} style={{ cursor: "pointer" }}>
                      <span style={{ color: "#f9a826" }}>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                      </span>
                      ({singleMotorItem?.rating} ratings)
                    </span>
                  </div>

                  {/* History Button */}
                  <button className="btn btn-primary" onClick={handleHistoryClick} style={{ backgroundColor: "#000d6b", color: "#fff" }}>
                    History
                  </button>
                </div>

                <p className="section__description">{singleMotorItem?.description}</p>

                <div className="d-flex align-items-center mt-3" style={{ columnGap: "4rem" }}>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-roadster-line" style={{ color: "#f9a826" }}></i> {singleMotorItem?.model}
                  </span>

                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-settings-2-line" style={{ color: "#f9a826" }}></i> {singleMotorItem?.automatic}
                  </span>

                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-timer-flash-line" style={{ color: "#f9a826" }}></i> {singleMotorItem?.speed}
                  </span>
                </div>

                <div className="d-flex align-items-center mt-3" style={{ columnGap: "2.8rem" }}>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-map-pin-line" style={{ color: "#f9a826" }}></i> {singleMotorItem?.gps}
                  </span>

                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-wheelchair-line" style={{ color: "#f9a826" }}></i> {singleMotorItem?.seatType}
                  </span>

                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-building-2-line" style={{ color: "#f9a826" }}></i> {singleMotorItem?.brand}
                  </span>
                </div>
              </div>
            </Col>

            <Col lg="7" className="mt-5">
              <div className="booking-info mt-5">
                <h5 className="mb-4 fw-bold ">Booking Information</h5>
                <BookingForm />
              </div>
            </Col>

            <Col lg="5" className="mt-5">
              <div className="payment__info mt-5">
                <h5 className="mb-4 fw-bold ">Payment Information</h5>
                <PaymentMethod />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </Helmet>
  );
};

export default MotorDetails;
