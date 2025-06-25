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
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import CarItem from "../components/UI/CarItem";
import carData from "../assets/data/carData";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";

// --- FAKE DATA FOR FILTERING OPTIONS ---
const fakeBrands = ["Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Audi"];
const fakeModels = {
  Toyota: ["Camry", "Corolla", "RAV4", "Hilux"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot"],
  Ford: ["Focus", "Mustang", "F-150", "Ranger"],
  BMW: ["3 Series", "5 Series", "X3", "X5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE"],
  Audi: ["A4", "A6", "Q5", "Q7"],
};
const fakeTransmissions = ["Manual", "Automatic"];
const fakeColors = ["Red", "Blue", "Black", "White", "Silver", "Gray"];
const fakeSeatOptions = [2, 4, 5, 7, 8];
const fakePriceRange = [0, 1000];
// ------------------------------------

const CarListing = () => {
  const [sortOption, setSortOption] = useState("Select");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortedCars, setSortedCars] = useState(carData);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State to hold selected filter values (currently not used for filtering logic)
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(fakeSeatOptions[0]); // Initialize with min seat value
  const [selectedPrice, setSelectedPrice] = useState(fakePriceRange[1]); // Initialize with max price value

  useEffect(() => {
    console.log("carData in CarListing:", carData); // Debug log to check data
    // Initialize sorted cars with the full data on mount
    setSortedCars(carData);
  }, []); // Empty dependency array means this runs once on mount

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...carData]; // Start sorting from the original data
    if (option === "Low to High") {
      sorted.sort(
        (a, b) =>
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
      );
    } else if (option === "High to Low") {
      sorted.sort(
        (a, b) =>
          parseFloat(b.price.replace("$", "")) -
          parseFloat(a.price.replace("$", ""))
      );
    }
    setSortedCars(sorted);
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
                      // REMOVED disabled attribute to make it interactive
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

                  {/* Model Filter - Populated from fakeModels */}
                  <div className="filter-group">
                    <label className="filter-label">Model</label>
                    <select
                      className="filter-dropdown"
                      // REMOVED disabled attribute
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option value="">Select Model</option>
                      {/* Simple flat list of all models */}
                      {Object.values(fakeModels)
                        .flat()
                        .map((model, index) => (
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
                        min={fakePriceRange[0]} // Set min from fake data
                        max={fakePriceRange[1]} // Set max from fake data
                        value={selectedPrice} // Bind value to state
                        onChange={(e) =>
                          setSelectedPrice(parseInt(e.target.value))
                        } // Update state on change
                      />
                      {/* Displaying the selected range */}
                      <span className="price-range-value">
                        0 - {selectedPrice}
                      </span>{" "}
                      {/* Display 0 to selected price */}
                    </div>
                  </div>

                  {/* Seats Filter (Range) */}
                  <div className="filter-group">
                    <label className="filter-label">Seats</label>
                    <input
                      type="range"
                      min={Math.min(...fakeSeatOptions)} // Use min from fake data
                      max={Math.max(...fakeSeatOptions)} // Use max from fake data
                      className="seats-slider"
                      value={selectedSeats} // Bind value to state
                      onChange={(e) =>
                        setSelectedSeats(parseInt(e.target.value))
                      } // Update state on change
                    />
                    {/* Displaying the selected value */}
                    <span className="seats-range-value">
                      {selectedSeats} Seats
                    </span>{" "}
                    {/* Display selected seat count */}
                  </div>

                  {/* Transmission Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Transmission</label>
                    <select
                      className="filter-dropdown"
                      // REMOVED disabled attribute
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
                      // REMOVED disabled attribute
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

                  {/* Reset Filters Button - Enable this if you add reset logic */}
                  <Button color="secondary" className="reset-filters-btn">
                    Reset Filters
                  </Button>
                </div>
              </Collapse>
            </Col>

            {/* Car Cards Column */}
            <Col lg="9">
              <Row>
                {sortedCars.length === 0 ? (
                  <Col lg="12">
                    <p className="no-cars-text">No cars available.</p>
                  </Col>
                ) : (
                  sortedCars.map((item) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.id}>
                      {/* Ensure your CarItem component is using the new classes and structure */}
                      <CarItem item={item} type={item.type || "car"} />{" "}
                      {/* Pass item.type or a default */}
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
