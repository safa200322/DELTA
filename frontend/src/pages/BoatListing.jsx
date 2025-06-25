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
import BoatItem from "../components/UI/BoatItem";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";

const fakeBoatPriceRange = [0, 50000];
const fakeCapacityRange = [1, 20];
const fakeBoatTypes = [
  "Fishing Boat",
  "Sail Boat",
  "Pontoon Boat",
  "Cruiser",
  "Yacht",
];
const fakeBoatBrands = [
  "Boston Whaler",
  "Sea Ray",
  "Grady-White",
  "Bayliner",
  "Sunseeker",
];
const fakeBoatSizes = ["Small", "Medium", "Large"];

const BoatListing = () => {
  const location = useLocation();

  const [sortOption, setSortOption] = useState("Select");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [displayedBoats, setDisplayedBoats] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(fakeBoatPriceRange[1]);
  const [selectedCapacity, setSelectedCapacity] = useState(
    fakeCapacityRange[1]
  );
  const [selectedType, setSelectedType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Store original boats data from backend
  const [originalBoats, setOriginalBoats] = useState([]);

  useEffect(() => {
    console.log("🚤 Boats from backend or location.state:", location.state?.boats);
    if (location.state && location.state.boats) {
      setOriginalBoats(location.state.boats);
      setDisplayedBoats(location.state.boats);
    } else {
      setOriginalBoats([]);
      setDisplayedBoats([]);
    }
  }, [location.state]);

  useEffect(() => {
    if (originalBoats.length === 0) return;

    let filtered = [...originalBoats];
    try {
      if (selectedCapacity !== fakeCapacityRange[1]) {
        filtered = filtered.filter(
          (boat) => (boat.capacity || 0) <= selectedCapacity
        );
      }
      if (selectedType) {
        filtered = filtered.filter(
          (boat) => boat.type?.toLowerCase() === selectedType.toLowerCase()
        );
      }
      if (selectedBrand) {
        filtered = filtered.filter(
          (boat) => boat.brand?.toLowerCase() === selectedBrand.toLowerCase()
        );
      }
      if (selectedSize) {
        filtered = filtered.filter(
          (boat) => boat.size?.toLowerCase() === selectedSize.toLowerCase()
        );
      }

      let sortedAndFiltered = [...filtered];
      if (sortOption === "Low to High") {
        sortedAndFiltered.sort((a, b) => {
          const priceA = parseFloat(
            (a.price || "0").replace(/[^0-9.-]+/g, "") || "0"
          );
          const priceB = parseFloat(
            (b.price || "0").replace(/[^0-9.-]+/g, "") || "0"
          );
          return priceA - priceB;
        });
      } else if (sortOption === "High to Low") {
        sortedAndFiltered.sort((a, b) => {
          const priceA = parseFloat(
            (a.price || "0").replace(/[^0-9.-]+/g, "") || "0"
          );
          const priceB = parseFloat(
            (b.price || "0").replace(/[^0-9.-]+/g, "") || "0"
          );
          return priceB - priceA;
        });
      }

      setDisplayedBoats(sortedAndFiltered);
    } catch (error) {
      console.error("Error in filtering boats:", error);
      setDisplayedBoats([]);
    }
  }, [selectedCapacity, selectedType, selectedBrand, selectedSize, sortOption, originalBoats]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);
  const handleSort = (option) => setSortOption(option);
  const handlePriceChange = (e) => setSelectedPrice(parseInt(e.target.value));
  const handleCapacityChange = (e) =>
    setSelectedCapacity(parseInt(e.target.value));
  const handleTypeChange = (e) => setSelectedType(e.target.value);
  const handleBrandChange = (e) => setSelectedBrand(e.target.value);
  const handleSizeChange = (e) => setSelectedSize(e.target.value);

  const handleResetFilters = () => {
    setSelectedPrice(fakeBoatPriceRange[1]);
    setSelectedCapacity(fakeCapacityRange[1]);
    setSelectedType("");
    setSelectedBrand("");
    setSelectedSize("");
    setSortOption("Select");
  };

  return (
    <Helmet title="Yachts">
      <CommonSection title="Yacht Listing" />
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
            <Col lg="3" className="mb-4">
              <Collapse
                isOpen={isFilterOpen}
                className="d-lg-block filter-panel"
              >
                <div className="filter-panel-content">
                  <h5 className="filter-title">Filters</h5>
                  <div className="filter-group">
                    <label className="filter-label">Price ($/day)</label>
                    <div className="price-range-inputs">
                      <input
                        type="range"
                        className="price-slider"
                        min={fakeBoatPriceRange[0]}
                        max={fakeBoatPriceRange[1]}
                        value={selectedPrice}
                        onChange={handlePriceChange}
                      />
                      <span className="price-range-value">
                        ${fakeBoatPriceRange[0]} - ${selectedPrice}
                      </span>
                    </div>
                  </div>
                  <div className="filter-group">
                    <label className="filter-label">Capacity (People)</label>
                    <input
                      type="range"
                      className="seats-slider"
                      min={fakeCapacityRange[0]}
                      max={fakeCapacityRange[1]}
                      value={selectedCapacity}
                      onChange={handleCapacityChange}
                    />
                    <span className="seats-range-value">
                      {selectedCapacity} People
                    </span>
                  </div>
                  <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                      className="filter-dropdown"
                      value={selectedType}
                      onChange={handleTypeChange}
                    >
                      <option value="">Select Type</option>
                      {fakeBoatTypes.map((type, index) => (
                        <option key={index} value={type.toLowerCase()}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label className="filter-label">Brand</label>
                    <select
                      className="filter-dropdown"
                      value={selectedBrand}
                      onChange={handleBrandChange}
                    >
                      <option value="">Select Brand</option>
                      {fakeBoatBrands.map((brand, index) => (
                        <option key={index} value={brand.toLowerCase()}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label className="filter-label">Size</label>
                    <select
                      className="filter-dropdown"
                      value={selectedSize}
                      onChange={handleSizeChange}
                    >
                      <option value="">Select Size</option>
                      {fakeBoatSizes.map((size, index) => (
                        <option key={index} value={size.toLowerCase()}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
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
            <Col lg="9">
              <Row>
                {displayedBoats.length === 0 ? (
                  <Col lg="12">
                    <p className="no-cars-text">No boats available.</p>
                  </Col>
                ) : (
                  displayedBoats.map((item) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.id || item.BoatID}>
                      <BoatItem item={item} type="yachts" />
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

export default BoatListing;