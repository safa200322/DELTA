import React, { useState, useEffect, useMemo } from "react";
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
import Footer from "../components/Footer/Footer";

import MotorItem from "../components/UI/MotorItem";
import VehicleSkeletonItem from "../components/UI/VehicleSkeletonItem";
import "../styles/car-listing.css";
import "../styles/skeleton.css";

const MotorListing = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allMotors, setAllMotors] = useState([]);
  const [sortedMotors, setSortedMotors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // State for filter selections
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(500); // Default max price

  useEffect(() => {
    const fetchMotors = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch(
          "http://localhost:5000/api/motorcycles/filtermotor"
        );
        const data = await response.json();
        setAllMotors(data);
        setSortedMotors(data);
      } catch (error) {
        console.error("Error fetching motors:", error);
      } finally {
        setIsLoading(false); // End loading regardless of result
      }
    };

    fetchMotors();
  }, []);

  const { brands, types, engines, colors, maxPrice } = useMemo(() => {
    const brands = [...new Set(allMotors.map((m) => m.Brand))].sort();
    const types = [...new Set(allMotors.map((m) => m.Type))].sort();
    const engines = [...new Set(allMotors.map((m) => m.Engine))].sort(
      (a, b) => a - b
    );
    const colors = [...new Set(allMotors.map((m) => m.color))].sort();
    const maxPrice = Math.max(...allMotors.map((m) => m.Price), 500);
    return { brands, types, engines, colors, maxPrice };
  }, [allMotors]);

  useEffect(() => {
    setSelectedPrice(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    let filtered = [...allMotors];

    if (selectedBrand) {
      filtered = filtered.filter(
        (m) => m.Brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    if (selectedType) {
      filtered = filtered.filter(
        (m) => m.Type.toLowerCase() === selectedType.toLowerCase()
      );
    }
    if (selectedEngine) {
      filtered = filtered.filter((m) => m.Engine === parseInt(selectedEngine));
    }
    if (selectedColor) {
      filtered = filtered.filter(
        (m) => m.color.toLowerCase() === selectedColor.toLowerCase()
      );
    }
    if (selectedPrice < maxPrice) {
      filtered = filtered.filter((m) => m.Price <= selectedPrice);
    }

    setSortedMotors(filtered);
  }, [
    selectedBrand,
    selectedType,
    selectedEngine,
    selectedColor,
    selectedPrice,
    allMotors,
    maxPrice,
  ]);

  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedType("");
    setSelectedEngine("");
    setSelectedColor("");
    setSelectedPrice(maxPrice);
    setSortedMotors(allMotors);
  };

  return (
    <Helmet title="Motors">
      <CommonSection title="Motor Listing" />

      <section className="car-listing-section">
        <Container>
          <Row className="mb-4">
            <Col lg="12">
              <div className="car-listing-controls d-flex align-items-center justify-content-between flex-wrap gap-3">
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
                      {brands.map((brand, index) => (
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
                      {types.map((type, index) => (
                        <option key={index} value={type.toLowerCase()}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Engine Size Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Engine Size (cc)</label>
                    <select
                      className="filter-dropdown"
                      value={selectedEngine}
                      onChange={(e) => setSelectedEngine(e.target.value)}
                    >
                      <option value="">Select Size</option>
                      {engines.map((size, index) => (
                        <option key={index} value={size}>
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
                        min={0}
                        max={maxPrice}
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

                  {/* Color Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Color</label>
                    <select
                      className="filter-dropdown"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Select Color</option>
                      {colors.map((color, index) => (
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
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Collapse>
            </Col>

            {/* Motor Cards Column */}
            <Col lg="9">
              <Row>
                {isLoading ? (
                  // Show skeletons while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={index}>
                      <VehicleSkeletonItem />
                    </Col>
                  ))
                ) : sortedMotors.length > 0 ? (
                  sortedMotors.map((item) => (
                    <Col
                      lg="4"
                      md="6"
                      sm="12"
                      className="mb-4"
                      key={item.VehicleID}
                    >
                      <MotorItem item={item} />
                    </Col>
                  ))
                ) : (
                  <Col lg="12" className="text-center">
                    <p>No motorcycles found.</p>
                  </Col>
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

export default MotorListing;
