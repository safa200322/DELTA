import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  Button,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import CarItem from "../components/UI/CarItem";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";

// Static data for filters
const fakeBrands = ["Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi"];

const fakeModels = [
  "Camry", "Civic", "Mustang", "X5", "C-Class", "A4", 
  "Corolla", "Accord", "F-150", "3 Series", "E-Class", "Q5",
  "Prius", "CR-V", "Explorer", "X3", "GLE", "A6"
];

const fakeTransmissions = [
  "Manual", 
  "Automatic", 
  "CVT", 
  "Semi-Automatic"
];

const CarListing = () => {
  const location = useLocation();

  const [sortOption, setSortOption] = useState("Select");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortedCars, setSortedCars] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(2);
  const [selectedPrice, setSelectedPrice] = useState(1000);

  useEffect(() => {
    console.log("🚀 Vehicles from backend or location.state:", location.state?.vehicles);
    if (location.state && location.state.vehicles) {
      setSortedCars(location.state.vehicles);
    } else {
      setSortedCars([]);
    }
  }, [location.state]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...sortedCars];
    if (option === "Low to High") {
      sorted.sort(
        (a, b) =>
          parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""))
      );
    } else if (option === "High to Low") {
      sorted.sort(
        (a, b) =>
          parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""))
      );
    }
    setSortedCars(sorted);
  };

  // Reset filters function
  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedTransmission("");
    setSelectedColor("");
    setSelectedSeats(2);
    setSelectedPrice(1000);
  };

  return (
    <Helmet title="Cars">
      <CommonSection title="Car Listing" />

      <section className="car-listing-section">
        <Container>
          <Row className="mb-4">
            <Col lg="12">
              <div className="car-listing-controls d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="sort-section d-flex align-items-center gap-2">
                  <span className="sort-label d-flex align-items-center gap-2">
                    <i className="ri-sort-asc"></i> Sort By
                  </span>
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle className="sort-dropdown">
                      {sortOption}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => handleSort("Select")}>
                        Select
                      </DropdownItem>
                      <DropdownItem onClick={() => handleSort("Low to High")}>
                        Low to High
                      </DropdownItem>
                      <DropdownItem onClick={() => handleSort("High to Low")}>
                        High to Low
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="filter-toggle-mobile d-lg-none">
                  <Button
                    color="primary"
                    onClick={toggleFilterPanel}
                    className="filter-toggle-btn"
                  >
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            {/* Filter Panel */}
            <Col lg="3" className="mb-4">
              <Collapse isOpen={isFilterOpen} className="d-lg-block filter-panel">
                <div className="filter-panel-content">
                  <h5 className="filter-title">Filters</h5>

                  {/* Brand Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Brand</label>
                    <select
                      className="filter-dropdown"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <option value="">Select Brand</option>
                      {fakeBrands.map((brand, index) => (
                        <option key={index} value={brand.toLowerCase()}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Model</label>
                    <select
                      className="filter-dropdown"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option value="">Select Model</option>
                      {fakeModels.map((model, index) => (
                        <option key={index} value={model.toLowerCase()}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter (Range) */}
                  <div className="filter-group">
                    <label className="filter-label">Price ($/day)</label>
                    <div className="price-range-inputs">
                      <input
                        type="range"
                        className="price-slider"
                        min={0}
                        max={1000}
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(parseInt(e.target.value))}
                      />
                      <span className="price-range-value">0 - {selectedPrice}</span>
                    </div>
                  </div>

                  {/* Seats Filter (Range) */}
                  <div className="filter-group">
                    <label className="filter-label">Seats</label>
                    <input
                      type="range"
                      min={2}
                      max={8}
                      className="seats-slider"
                      value={selectedSeats}
                      onChange={(e) => setSelectedSeats(parseInt(e.target.value))}
                    />
                    <span className="seats-range-value">{selectedSeats} Seats</span>
                  </div>

                  {/* Transmission Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Transmission</label>
                    <select
                      className="filter-dropdown"
                      value={selectedTransmission}
                      onChange={(e) => setSelectedTransmission(e.target.value)}
                    >
                      <option value="">Select Transmission</option>
                      {fakeTransmissions.map((transmission, index) => (
                        <option key={index} value={transmission.toLowerCase()}>
                          {transmission}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Color</label>
                    <select
                      className="filter-dropdown"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Select Color</option>
                      {/* No options yet */}
                    </select>
                  </div>

                  {/* Reset Filters Button */}
                  <Button 
                    color="secondary" 
                    className="reset-filters-btn"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Collapse>
            </Col>

            {/* Car Cards */}
            <Col lg="9">
              <Row>
                {sortedCars.length === 0 ? (
                  <Col lg="12">
                    <p className="no-cars-text">No cars available.</p>
                  </Col>
                ) : (
                  sortedCars.map((item) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.id || item.VehicleID}>
                      <CarItem item={item} type={item.type || "car"} />
                    </Col>
                  ))
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </Helmet>
  );
};

export default CarListing;