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
import Footer from "../components/Footer/Footer";
import MotorItem2 from "../components/UI/MotorItem2";
import "../styles/car-listing.css";

const fakeBrands = ["Honda", "Yamaha", "Kawasaki", "Suzuki", "Harley-Davidson"];
const fakeTypes = ["Sportbike", "Cruiser", "Naked Bike", "Adventure", "Scooter"];
const fakeEngineSizes = ["125cc", "200cc","300cc", "600cc", "1000cc", "Electric"];
const fakePriceRange = [0, 500];
const fakeSeatOptions = [1, 2];
const fakeTransmissions = ["Manual", "Automatic"];
const fakeColors = ["Red", "Blue", "Black", "White", "Silver", "Gray"];

const MotorListing2 = () => {
  const [sortOption, setSortOption] = useState("Select");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [motors, setMotors] = useState([]); // All fetched motors
  const [filteredMotors, setFilteredMotors] = useState([]); // Displayed motors after filtering
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters state — all selectable, but only brand & engineSize affect filtering
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedEngineSize, setSelectedEngineSize] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(fakePriceRange);
  const [selectedSeats, setSelectedSeats] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        const response = await fetch(
          "https://localhost:443/api/vehicles2/motorcycles2",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch motorcycles");

        const data = await response.json();
        const fetchedMotors = data.vehicles || [];
        console.log("Fetched motors:", fetchedMotors);
        setMotors(fetchedMotors);
        setFilteredMotors(fetchedMotors);
      } catch (err) {
        console.error("❌ Error fetching motorcycles:", err);
        setMotors([]);
        setFilteredMotors([]);
      }
    };

    fetchMotors();
  }, []);

  useEffect(() => {
    // Only apply brand and engineSize filtering
    let filtered = motors;

    if (selectedBrand) {
      filtered = filtered.filter(
        (motor) =>
          motor.brand &&
          motor.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (selectedEngineSize) {
      filtered = filtered.filter(
        (motor) =>
          motor.engineSize &&
          motor.engineSize.toLowerCase() === selectedEngineSize.toLowerCase()
      );
    }

    setFilteredMotors(filtered);
  }, [selectedBrand, selectedEngineSize, motors]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...filteredMotors];
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
    setFilteredMotors(sorted);
  };

  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedEngineSize("");
    setSelectedType("");
    setSelectedPriceRange(fakePriceRange);
    setSelectedSeats("");
    setSelectedTransmission("");
    setSelectedColor("");
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
            <Col lg="3" className="mb-4">
              <Collapse isOpen={isFilterOpen} className="d-lg-block filter-panel">
                <div className="filter-panel-content">
                  <h5 className="filter-title">Filters</h5>

                  {/* Brand */}
                  <div className="filter-group">
                    <label className="filter-label">Brand</label>
                    <select
                      className="filter-dropdown"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <option value="">Select Brand</option>
                      {fakeBrands.map((brand, i) => (
                        <option key={i} value={brand.toLowerCase()}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                      className="filter-dropdown"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {fakeTypes.map((type, i) => (
                        <option key={i} value={type.toLowerCase()}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Engine Size */}
                  <div className="filter-group">
                    <label className="filter-label">Engine Size</label>
                    <select
                      className="filter-dropdown"
                      value={selectedEngineSize}
                      onChange={(e) => setSelectedEngineSize(e.target.value)}
                    >
                      <option value="">Select Engine Size</option>
                      {fakeEngineSizes.map((size, i) => (
                        <option key={i} value={size.toLowerCase()}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range (still selectable but not filtering) */}
                  <div className="filter-group">
                    <label className="filter-label">Price ($/day)</label>
                    <input
                      type="range"
                      min={fakePriceRange[0]}
                      max={fakePriceRange[1]}
                      value={selectedPriceRange[1]}
                      onChange={(e) =>
                        setSelectedPriceRange([fakePriceRange[0], Number(e.target.value)])
                      }
                    />
                    <div>
                      {selectedPriceRange[0]} - {selectedPriceRange[1]}
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="filter-group">
                    <label className="filter-label">Seats</label>
                    <select
                      className="filter-dropdown"
                      value={selectedSeats}
                      onChange={(e) => setSelectedSeats(e.target.value)}
                    >
                      <option value="">Select Seats</option>
                      {fakeSeatOptions.map((seat, i) => (
                        <option key={i} value={seat}>
                          {seat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Transmission */}
                  <div className="filter-group">
                    <label className="filter-label">Transmission</label>
                    <select
                      className="filter-dropdown"
                      value={selectedTransmission}
                      onChange={(e) => setSelectedTransmission(e.target.value)}
                    >
                      <option value="">Select Transmission</option>
                      {fakeTransmissions.map((trans, i) => (
                        <option key={i} value={trans.toLowerCase()}>
                          {trans}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color */}
                  <div className="filter-group">
                    <label className="filter-label">Color</label>
                    <select
                      className="filter-dropdown"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Select Color</option>
                      {fakeColors.map((color, i) => (
                        <option key={i} value={color.toLowerCase()}>
                          {color}
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
                {filteredMotors.length === 0 ? (
                  <Col lg="12">
                    <p className="no-cars-text">No motors available.</p>
                  </Col>
                ) : (
                  filteredMotors.map((item) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.VehicleID}>
                      <MotorItem2 item={item} type={item.type || "motors"} />
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

export default MotorListing2;
