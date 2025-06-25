import React from "react";
import { NavLink } from "react-router-dom";
import HeroSlider from "../components/UI/HeroSlider";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Button } from "reactstrap";
import FindCarForm from "../components/UI/FindCarForm";
import ServicesList from "../components/UI/ServicesList";
import carData from "../assets/data/carData";
import boatData from "../assets/data/boatData";
import motorData from "../assets/data/motorData";
import CarItem from "../components/UI/CarItem";
import MotorItem from "../components/UI/MotorItem";
import BoatItem from "../components/UI/BoatItem";
import Footer from "../components/Footer/Footer";
import "../styles/hero-slider.css";
import "../styles/car-item.css";

const Home = () => {
  const navLinks = [
    { path: "/home", display: "Home" },
    { path: "/about", display: "About" },
    { path: "/cars2", display: "Cars" },
    { path: "/motors2", display: "Motors" },
    { path: "/bicycle", display: "Bicycles" },
    { path: "/yachts", display: "Yachts" },
    { path: "/contact", display: "Contact" },
  ];

  return (
    <Helmet title="Home">
      {/* ============= hero section =========== */}
      <section className="hero__search-section">
        <Container>
          {/* Headline */}
          <h1 className="hero__title text-white text-center mb-5">
            Thousands of vehicles. One simple search.
          </h1>

          {/* Navigation Links */}
          <div className="main-nav d-flex justify-content-center gap-4 mb-4">
            {navLinks.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "main-nav-link active" : "main-nav-link"
                }
              >
                {item.display}
              </NavLink>
            ))}
          </div>

          {/* Search Form (without tabs) */}
          <div className="search__form-container bg-white p-4 rounded-3 shadow-sm mx-auto">
            <FindCarForm />
          </div>
        </Container>
      </section>

      {/* ========== services section ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5 text-center">
              <h6 className="section__subtitle">See our</h6>
              <h2 className="section__title">Popular Services</h2>
            </Col>
            <ServicesList />
          </Row>
        </Container>
      </section>

      {/* =========== car offer section ============= */}
      <section className="hot-offers-section py-5">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h6 className="section__subtitle text-primary mb-3">Come with</h6>
              <h2 className="section__title mb-4">Hot Offers</h2>
            </Col>
            {carData.slice(0, 3).map((item) => (
              <Col lg="4" md="6" sm="12" className="mb-4" key={item.id}>
                <CarItem item={item} type="car" />
              </Col>
            ))}
            {motorData.slice(0, 3).map((item) => (
              <Col lg="4" md="6" sm="12" className="mb-4" key={item.id}>
                <MotorItem item={item} type="motor" />
              </Col>
            ))}
            {boatData.slice(0, 3).map((item) => (
              <Col lg="4" md="6" sm="12" className="mb-4" key={item.id}>
                <BoatItem item={item} type="boat" />
              </Col>
            ))}
            <Col lg="12" className="text-center mt-4">
              <Button
                color="primary"
                className="view-all-btn px-5 py-3 rounded-5"
                tag={NavLink}
                to="/cars2"
              >
                View All Cars
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </Helmet>
  );
};

export default Home;
