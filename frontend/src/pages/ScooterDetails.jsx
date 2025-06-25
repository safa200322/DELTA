import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import Helmet from "../components/Helmet/Helmet";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";
import Footer from "../components/Footer/Footer";
import scooterData from "../assets/data/scooterData";

const ScooterDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const singleCarItem = scooterData.find((item) => item.carName === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleCarItem]);

  const handleHistoryClick = () => {
    navigate("/timeline");
  };

  const handleReviewsClick = () => {
    navigate("/reviews");
  };

  return (
    <Helmet title={singleCarItem.carName}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img src={singleCarItem.imgUrl} alt="" className="w-100" />
            </Col>

            <Col lg="6">
              <div className="car__info">
                <h2 className="section__title">{singleCarItem.carName}</h2>

                {/* PRICE + RATING + HISTORY BUTTON */}
                <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
                  <div className="d-flex align-items-center gap-4">
                    <h6 className="rent__price fw-bold fs-4">${singleCarItem.price}.00 / Day</h6>

                    <span className="d-flex align-items-center gap-2" onClick={handleReviewsClick} style={{ cursor: "pointer" }}>
                      <span style={{ color: "#f9a826" }}>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                        <i className="ri-star-s-fill"></i>
                      </span>
                      ({singleCarItem.rating} ratings)
                    </span>
                  </div>

                  <button className="btn btn-primary" onClick={handleHistoryClick} style={{ backgroundColor: "#000d6b", color: "#fff" }}>
                    History
                  </button>
                </div>

                <p className="section__description">{singleCarItem.description}</p>

                <div className="d-flex align-items-center mt-3" style={{ columnGap: "4rem" }}>
                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-roadster-line" style={{ color: "#f9a826" }}></i>
                    {singleCarItem.model}
                  </span>

                  <span className="d-flex align-items-center gap-1 section__description">
                    <i className="ri-building-2-line" style={{ color: "#f9a826" }}></i>
                    {singleCarItem.brand}
                  </span>
                </div>
              </div>
            </Col>

            <Col lg="7" className="mt-5">
              <div className="booking-info mt-5">
                <h5 className="mb-4 fw-bold">Booking Information</h5>
                <BookingForm />
              </div>
            </Col>

            <Col lg="5" className="mt-5">
              <div className="payment__info mt-5">
                <h5 className="mb-4 fw-bold">Payment Information</h5>
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

export default ScooterDetails;
