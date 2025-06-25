import React, { useState, useEffect } from "react";
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
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import motorData from "../assets/data/motorData";
import Footer from "../components/Footer/Footer";

import MotorItem from "../components/UI/MotorItem";
import "../styles/car-listing.css";

// Fake data for filter options (not used for filtering, just for dropdowns)
const fakeBrands = ["Honda", "Yamaha", "Kawasaki", "Suzuki", "Harley-Davidson"];
const fakeTypes = [
  "Sportbike",
  "Cruiser",
  "Naked Bike",
  "Adventure",
  "Scooter",
];
const fakeEngineSizes = ["125cc", "300cc", "600cc", "1000cc+", "Electric"];
const fakePriceRange = [0, 500];
const fakeSeatOptions = [1, 2];
const fakeTransmissions = ["Manual", "Automatic"];
const fakeColors = ["Red", "Blue", "Black", "White", "Silver", "Gray"];

const CarListing = () => {
  const [sortOption, setSortOption] = useState("Select");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortedMotors, setSortedMotors] = useState(motorData || []);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State for filter selections (interactive but not used for filtering)
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedEngineSize, setSelectedEngineSize] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(fakeSeatOptions[0]); // Min seats, like car version
  const [selectedPrice, setSelectedPrice] = useState(fakePriceRange[1]); // Max price, like car version

  useEffect(() => {
    console.log("motorData in CarListing:", motorData);
    if (!motorData || !Array.isArray(motorData)) {
      console.error("motorData is invalid or empty:", motorData);
      setSortedMotors([]);
      return;
    }

    // Initialize sorted motors with full data
    setSortedMotors(motorData);
  }, []); // Empty dependency array, runs once on mount

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...motorData];
    if (option === "Low to High") {
      sorted.sort(
        (a, b) =>
          parseFloat(a.price?.replace("$", "") || 0) -
          parseFloat(b.price?.replace("$", "") || 0)
      );
    } else if (option === "High to Low") {
      sorted.sort(
        (a, b) =>
          parseFloat(b.price?.replace("$", "") || 0) -
          parseFloat(a.price?.replace("$", "") || 0)
      );
    }
    setSortedMotors(sorted);
  };

  return (
    <Helmet title="Motors">
      <CommonSection title="Motor Listing" />

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
                    <DropdownToggle caret className="sort-dropdown">
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
            {/* Filter Panel Column */}
            <Col lg="3" className="mb-4">
              <Collapse
                isOpen={isFilterOpen}
                className="d-lg-block filter-panel"
              >
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

                  {/* Type Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                      className="filter-dropdown"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {fakeTypes.map((type, index) => (
                        <option key={index} value={type.toLowerCase()}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Engine Size Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Engine Size</label>
                    <select
                      className="filter-dropdown"
                      value={selectedEngineSize}
                      onChange={(e) => setSelectedEngineSize(e.target.value)}
                    >
                      <option value="">Select Size</option>
                      {fakeEngineSizes.map((size, index) => (
                        <option key={index} value={size.toLowerCase()}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Price ($/day)</label>
                    <div className="price-range-inputs">
                      <input
                        type="range"
                        className="price-slider"
                        min={fakePriceRange[0]}
                        max={fakePriceRange[1]}
                        value={selectedPrice}
                        onChange={(e) =>
                          setSelectedPrice(parseInt(e.target.value))
                        }
                      />
                      <span className="price-range-value">
                        0 - {selectedPrice}
                      </span>
                    </div>
                  </div>

                  {/* Seats Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Seats</label>
                    <input
                      type="range"
                      className="seats-slider"
                      min={Math.min(...fakeSeatOptions)}
                      max={Math.max(...fakeSeatOptions)}
                      value={selectedSeats}
                      onChange={(e) =>
                        setSelectedSeats(parseInt(e.target.value))
                      }
                    />
                    <span className="seats-range-value">
                      {selectedSeats} {selectedSeats === 1 ? "Seat" : "Seats"}
                    </span>
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
                      {fakeTransmissions.map((trans, index) => (
                        <option key={index} value={trans.toLowerCase()}>
                          {trans}
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
                      {fakeColors.map((color, index) => (
                        <option key={index} value={color.toLowerCase()}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Filters Button */}
                  <Button
                    color="secondary"
                    className="reset-filters-btn"
                    disabled // Disabled, like car version
                  >
                    Reset Filters
                  </Button>
                </div>
              </Collapse>
            </Col>

            {/* Motor Cards Column */}
            <Col lg="9">
              <Row>
                {sortedMotors.length === 0 ? (
                  <Col lg="12">
                    <p className="no-cars-text">No motors available.</p>
                  </Col>
                ) : (
                  sortedMotors.map((item) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.id}>
                      <MotorItem item={item} type="motors" />
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
