import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown, // Added for Sort By dropdown design
  DropdownToggle, // Added for Sort By dropdown design
  DropdownMenu, // Added for Sort By dropdown design
  DropdownItem, // Added for Sort By dropdown design
  Collapse, // Added for mobile filter panel collapse design
  Button, // Added for mobile filter toggle button design
} from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
// No ScooterItem or scooterData needed for this motor listing page
// import ScooterItem from "../components/UI/ScooterItem";
// import scooterData from "../assets/data/scooterData";
import Footer from "../components/Footer/Footer";
import MotorItem from "../components/UI/MotorItem"; // Using your MotorItem component

// Import the same CSS file used for car listing design
import "../styles/car-listing.css";
import scooterData from "../assets/data/scooterData";
import ScooterItem from "../components/UI/ScooterItem";

// --- FAKE DATA FOR FILTERING OPTIONS (Used ONLY for populating the design elements) ---
// This data is used to show options in the UI, but does not affect the listed motors
const fakeBrands = ["Honda", "Yamaha", "Kawasaki", "Suzuki", "Harley-Davidson"];
const fakeTypes = ["Sportbike", "Cruiser", "Naked Bike", "Adventure", "Scooter"];
const fakeEngineSizes = ["125cc", "300cc", "600cc", "1000cc+", "Electric"];
const fakePriceRange = [0, 500]; // Example price range for motors ($/day)
const fakeSeatOptions = [1, 2]; // Motors typically have 1 or 2 seats
const fakeTransmissions = ["Manual", "Automatic"]; // Assuming motors have these options
const fakeColors = ["Red", "Blue", "Black", "White", "Silver", "Gray"]; // Example colors
// ------------------------------------------------------------------------------

const CarListing = () => {
  // Keeping component name as CarListing as requested
  // State variables needed ONLY for the visual behavior of the sort dropdown and filter panel toggle
  const [sortOption, setSortOption] = useState("Select"); // To display the selected text in the sort dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false); // To toggle the sort dropdown's open/close state
  // Using sortedMotors state for the list as in your second code block, initialized with motorData
  const [sortedMotors, setSortedMotors] = useState(scooterData || []);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // To toggle the mobile filter panel's open/close state

  // State for filter selections (interactive but NOT used for filtering logic)
  // These states are kept to allow selection in the disabled inputs, mirroring the structure
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedEngineSize, setSelectedEngineSize] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(fakeSeatOptions[0]); // Initialize with min seats for visual consistency
  const [selectedPrice, setSelectedPrice] = useState(fakePriceRange[1]); // Initialize with max price for visual consistency

  // useEffect to initialize motors on mount (as in your second code block)
  useEffect(() => {
    console.log("motorData in CarListing:", scooterData);
    if (!scooterData || !Array.isArray(scooterData)) {
      console.error("motorData is invalid or empty:", scooterData);
      setSortedMotors([]); // Set to empty array if data is bad
    } else {
      setSortedMotors(scooterData); // Initialize with the motor data
    }
  }, []); // Empty dependency array, runs once on mount

  // Removed the useEffect for filtering and sorting logic as requested

  // Toggle function for the Sort By dropdown's visual open/close
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Toggle function for the mobile Filter Panel's visual open/close
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  // Handler for Sort option (Design only - just changes the displayed text)
  const handleSort = (option) => {
    setSortOption(option); // Updates displayed text in dropdown toggle
    // No actual sorting logic here as requested
  };

  // Placeholder handlers for filter changes (Design only - just update state)
  const handleBrandChange = (e) => setSelectedBrand(e.target.value);
  const handleTypeChange = (e) => setSelectedType(e.target.value);
  const handleEngineSizeChange = (e) => setSelectedEngineSize(e.target.value);
  const handlePriceChange = (e) => setSelectedPrice(parseInt(e.target.value));
  const handleSeatsChange = (e) => setSelectedSeats(parseInt(e.target.value));
  const handleTransmissionChange = (e) => setSelectedTransmission(e.target.value);
  const handleColorChange = (e) => setSelectedColor(e.target.value);

  // Placeholder handler for Reset Filters button (Design only - just reset state)
  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedType("");
    setSelectedEngineSize("");
    setSelectedPrice(fakePriceRange[1]); // Reset price to max
    setSelectedSeats(fakeSeatOptions[0]); // Reset seats to min for visual consistency with car version
    setSelectedTransmission("");
    setSelectedColor("");
    setSortOption("Select"); // Reset sort option text
    // No actual filtering reset logic here
  };

  return (
    <Helmet title="Bicycles">
      {" "}
      {/* Page title */}
      <CommonSection title="Bicycles Listing" /> {/* Common section title */}
      {/* Main listing section applying the car listing design styles */}
      <section className="car-listing-section">
        <Container>
          {/* Row for Sort and Filter Controls at the top */}
          <Row className="mb-4">
            <Col lg="12">
              {/* Container applying design styles for the controls area */}
              <div className="car-listing-controls d-flex align-items-center justify-content-between flex-wrap gap-3">
                {/* Sort Section (Design only - no functional sorting) */}
                <div className="sort-section d-flex align-items-center gap-2">
                  <span className="sort-label d-flex align-items-center gap-2">
                    {/* Icon from Remixicon CSS library */}
                    <i className="ri-sort-asc"></i> Sort By
                  </span>
                  {/* Sort Dropdown (Design only - visual toggle works, selection updates displayed text) */}
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle caret className="sort-dropdown">
                      {" "}
                      {/* Added 'caret' for the dropdown arrow */}
                      {sortOption} {/* Displays the visually selected option */}
                    </DropdownToggle>
                    <DropdownMenu>
                      {/* Dropdown items - onClick just changes the displayed text state */}
                      <DropdownItem onClick={() => handleSort("Select")}>Select</DropdownItem>
                      <DropdownItem onClick={() => handleSort("Low to High")}>Low to High</DropdownItem>
                      <DropdownItem onClick={() => handleSort("High to Low")}>High to Low</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                {/* Filter Toggle Button (Visible on small screens, visually opens/closes filter panel) */}
                <div className="filter-toggle-mobile d-lg-none">
                  <Button color="primary" onClick={toggleFilterPanel} className="filter-toggle-btn">
                    {isFilterOpen ? "Hide Filters" : "Show Filters"} {/* Button text changes visually */}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Main Content Row: Filter Panel Column (lg="3") + Motor List Column (lg="9") */}
          <Row>
            {/* Filter Panel Column (Takes 3 columns on large screens) - Design only, no functional filtering */}
            <Col lg="3" className="mb-4">
              {/* Collapse component - controls visual visibility on small screens */}
              <Collapse
                isOpen={isFilterOpen} // Controls collapse state visually
                className="d-lg-block filter-panel" // Always block on large screens for layout
              >
                {/* Inner container for filter groups and styling */}
                <div className="filter-panel-content">
                  {/* Title for the filter panel */}
                  <h5 className="filter-title">Filters</h5>

                  {/* Brand Filter Group (Design only - inputs are disabled) */}
                  <div className="filter-group">
                    <label className="filter-label">Brand</label>
                    {/* Select dropdown - interactive visually (state updates) but no filtering */}
                    <select
                      className="filter-dropdown"
                      value={selectedBrand} // Bound to state
                      onChange={handleBrandChange} // Updates state on change
                      disabled // Explicitly disabled as per "no functionality"
                    >
                      <option value="">Select Brand</option> {/* Static default option */}
                      {/* Options populated visually from fake data */}
                      {fakeBrands.map((brand, index) => (
                        <option key={index} value={brand.toLowerCase()}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter Group (Design only - inputs are disabled) */}
                  <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select
                      className="filter-dropdown"
                      value={selectedType} // Bound to state
                      onChange={handleTypeChange} // Updates state on change
                      disabled // Disabled
                    >
                      <option value="">Select Type</option> {/* Static default option */}
                      {/* Options populated visually */}
                      {fakeTypes.map((type, index) => (
                        <option key={index} value={type.toLowerCase()}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Engine Size Filter Group (Design only - inputs are disabled) */}
                  <div className="filter-group">
                    <label className="filter-label">Engine Size</label>
                    <select
                      className="filter-dropdown"
                      value={selectedEngineSize} // Bound to state
                      onChange={handleEngineSizeChange} // Updates state on change
                      disabled // Disabled
                    >
                      <option value="">Select Size</option> {/* Static default option */}
                      {/* Options populated visually */}
                      {fakeEngineSizes.map((size, index) => (
                        <option key={index} value={size.toLowerCase()}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter Group (Range) (Design only - input is disabled) */}
                  <div className="filter-group">
                    <label className="filter-label">Price ($/day)</label>
                    <div className="price-range-inputs">
                      {/* Range input - interactive visually (state updates) but no filtering */}
                      <input
                        type="range"
                        className="price-slider"
                        min={fakePriceRange[0]} // Visual range min
                        max={fakePriceRange[1]} // Visual range max
                        value={selectedPrice} // Bound to state
                        onChange={handlePriceChange} // Updates state on change
                        disabled // Disabled
                      />
                      {/* Displaying the visually selected price */}
                      <span className="price-range-value">
                        ${fakePriceRange[0]} - ${selectedPrice} {/* Displays range based on state */}
                      </span>
                    </div>
                  </div>

                  {/* Seats Filter Group (Range) (Design only - input is disabled) */}
                  <div className="filter-group">
                    <label className="filter-label">Seats</label>
                    <input
                      type="range"
                      className="seats-slider"
                      min={Math.min(...fakeSeatOptions)} // Visual range min
                      max={Math.max(...fakeSeatOptions)} // Visual range max
                      value={selectedSeats} // Bound to state
                      onChange={handleSeatsChange} // Updates state on change
                      disabled // Disabled
                    />
                    {/* Displaying the visually selected seat count */}
                    <span className="seats-range-value">
                      {selectedSeats} {selectedSeats === 1 ? "Seat" : "Seats"} {/* Displays count based on state */}
                    </span>
                  </div>

                  {/* Transmission Filter Group (Design only - inputs are disabled) */}
                  <div className="filter-group">
                    <label className="filter-label">Transmission</label>
                    <select
                      className="filter-dropdown"
                      value={selectedTransmission} // Bound to state
                      onChange={handleTransmissionChange} // Updates state on change
                      disabled // Disabled
                    >
                      <option value="">Select Transmission</option> {/* Static default option */}
                      {fakeTransmissions.map((trans, index) => (
                        <option key={index} value={trans.toLowerCase()}>
                          {trans}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Filter Group (Design only - inputs are disabled) */}
                  <div className="filter-group">
                    <label className="filter-label">Color</label>
                    <select
                      className="filter-dropdown"
                      value={selectedColor} // Bound to state
                      onChange={handleColorChange} // Updates state on change
                      disabled // Disabled
                    >
                      <option value="">Select Color</option> {/* Static default option */}
                      {fakeColors.map((color, index) => (
                        <option key={index} value={color.toLowerCase()}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Filters Button (Design only - disabled) */}
                  <Button
                    color="secondary"
                    className="reset-filters-btn"
                    onClick={handleResetFilters} // Calls handler to reset state visually
                    disabled // Button is disabled
                  >
                    Reset Filters
                  </Button>
                </div>
              </Collapse>
            </Col>

            {/* Motor Cards Column (Takes 9 columns on large screens) - Maps original data, no filtering/sorting */}
            <Col lg="9">
              <Row>
                {/* Map over the original motorData */}
                {/* Since there's no filtering/sorting logic, sortedMotors holds the initial motorData */}
                {sortedMotors.length === 0 ? (
                  <Col lg="12">
                    {/* Message displayed if original data is empty or invalid */}
                    <p className="no-cars-text">No motors available.</p>
                  </Col>
                ) : (
                  sortedMotors.map(
                    (
                      item // Mapping the state which holds initial motorData
                    ) => (
                      <Col lg="4" md="6" sm="12" className="mb-4" key={item.id}>
                        {/* Render each motor item using the MotorItem component */}
                        <ScooterItem item={item} key={item.id} type="Bikes" /> {/* Using MotorItem */}
                      </Col>
                    )
                  )
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

export default CarListing; // Exporting as CarListing as requested
