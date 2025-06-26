import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import FindCarForm from "../components/UI/FindCarForm";
import ServicesList from "../components/UI/ServicesList";
import CarItem from "../components/UI/CarItem";
import MotorItem from "../components/UI/MotorItem";
import BoatItem from "../components/UI/BoatItem";
import BicycleItem from "../components/UI/BicycleItem";
import Footer from "../components/Footer/Footer";
import "../styles/hero-slider.css";
import "../styles/car-item.css";

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch vehicles for the Hot Offers section
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // Fetch vehicles from different endpoints
        const [carsResponse, motorcyclesResponse, bicyclesResponse, boatsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/vehicles/filter"),
          fetch("http://localhost:5000/api/motorcycles/filtermotor"),
          fetch("http://localhost:5000/api/bicycles/filterbicycle"),
          fetch("http://localhost:5000/api/boats/filter")
        ]);

        // Process responses
        const cars = carsResponse.ok ? await carsResponse.json() : [];
        const motorcycles = motorcyclesResponse.ok ? await motorcyclesResponse.json() : [];
        const bicycles = bicyclesResponse.ok ? await bicyclesResponse.json() : [];
        const boats = boatsResponse.ok ? await boatsResponse.json() : [];

        // Add type property to each vehicle
        const typedCars = cars.map(car => ({ ...car, Type: 'Car' }));
        const typedMotorcycles = motorcycles.map(motor => ({ ...motor, Type: 'Motorcycle' }));
        const typedBicycles = bicycles.map(bicycle => ({ ...bicycle, Type: 'Bicycle' }));
        const typedBoats = boats.map(boat => ({ ...boat, Type: 'Boat' }));

        // Combine all vehicles
        const allVehicles = [...typedCars, ...typedMotorcycles, ...typedBicycles, ...typedBoats];

        // Get random 10 vehicles or all if less than 10
        const randomVehicles = allVehicles.sort(() => 0.5 - Math.random()).slice(0, 10);
        setVehicles(randomVehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const navLinks = [
    { path: "/home", display: "Home" },
    { path: "/about", display: "About" },
    { path: "/cars", display: "Cars" },
    { path: "/motorcycles", display: "Motors" },
    { path: "/bicycle", display: "Bicycles" },
    { path: "/boats", display: "Boats" },
    { path: "/contact", display: "Contact" },
  ];

  const searchTabs = [
    { path: "/cars", display: "Vehicles" },
    { path: "/bicycle", display: "Bicycles" },
    { path: "/boats", display: "Boats" },
  ];

  return (
    <Helmet title="Home">
      {/* ============= hero section =========== */}
      <section className="hero__search-section">
        <Container>
          {/* Headline */}
          <h1 className="hero__title text-white text-center mb-5">Thousands of vehicles. One simple search.</h1>

          {/* Navigation Links */}
          <div className="main-nav d-flex justify-content-center gap-4 mb-4">
            {navLinks.map((item, index) => (
              <NavLink key={index} to={item.path} className={({ isActive }) => (isActive ? "main-nav-link active" : "main-nav-link")}>
                {item.display}
              </NavLink>
            ))}
          </div>

          {/* Search Form */}
          <div className="search__form-container bg-white p-4 rounded-3 shadow-sm mx-auto">
            <div className="search-tabs d-flex gap-3 mb-4">
              {searchTabs.map((tab, index) => (
                <NavLink key={index} to={tab.path} className={({ isActive }) => (isActive ? "search-tab active" : "search-tab")}>
                  {tab.display}
                </NavLink>
              ))}
            </div>
            <FindCarForm />
          </div>
        </Container>
      </section>

      {/* Optional: HeroSlider below the search section */}
      {/* <section className="p-0 hero__slider-section">
        <HeroSlider />
      </section> */}

      {/* =========== about section ================ */}
      {/* <AboutSection /> */}

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

            {loading ? (
              <Col lg="12" className="text-center">
                <p>Loading hot offers...</p>
              </Col>
            ) : vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <Col lg="4" md="6" sm="12" className="mb-4" key={vehicle.VehicleID}>
                  {vehicle.Type === 'Car' && <CarItem item={vehicle} type="car" />}
                  {vehicle.Type === 'Motorcycle' && <MotorItem item={vehicle} type="motor" />}
                  {vehicle.Type === 'Bicycle' && <BicycleItem item={vehicle} type="bicycle" />}
                  {vehicle.Type === 'Boat' && <BoatItem item={vehicle} type="boat" />}
                </Col>
              ))
            ) : (
              <Col lg="12" className="text-center">
                <p>No vehicles available right now.</p>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      <Footer />
    </Helmet>
  );
};

export default Home;
