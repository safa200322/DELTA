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
  Spinner
} from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import CarItem from "../components/UI/CarItem";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";
import CarItem2 from "../components/UI/CarItem2";

const CarListing2 = () => {
  const [sortOption, setSortOption] = useState("Select");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortedCars, setSortedCars] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(2);
  const [selectedPrice, setSelectedPrice] = useState(1000);
  
  // Extract unique values for filters from the car data
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [colors, setColors] = useState([]);

  // Fetch cars data from backend using fetch API
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
   
      const response = await fetch("https://localhost:443/api/vehicles2/cars2", {
      headers: {
        "Content-Type": "application/json",
        
      },
    });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const cars = data.vehicles || data; // Handle both {vehicles: [...]} and direct array responses
      
      setSortedCars(cars);
      
      // Extract filter options from the data
      const uniqueBrands = [...new Set(cars.map(car => car.brand))];
      const uniqueModels = [...new Set(cars.map(car => car.model))];
      const uniqueTransmissions = [...new Set(cars.map(car => car.transmission))];
      const uniqueColors = [...new Set(cars.map(car => car.color))];
      
      setBrands(uniqueBrands);
      setModels(uniqueModels);
      setTransmissions(uniqueTransmissions);
      setColors(uniqueColors);
      
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("Failed to load cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleSort = (option) => {
    setSortOption(option);
    let sorted = [...sortedCars];
    
    if (option === "Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === "High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    
    setSortedCars(sorted);
  };

  // Apply all filters
  const applyFilters = () => {
    let filtered = [...sortedCars];
    
    if (selectedBrand) {
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }
    
    if (selectedModel) {
      filtered = filtered.filter(car => 
        car.model.toLowerCase().includes(selectedModel.toLowerCase())
      );
    }
    
    if (selectedTransmission) {
      filtered = filtered.filter(car => 
        car.transmission.toLowerCase().includes(selectedTransmission.toLowerCase())
      );
    }
    
    if (selectedColor) {
      filtered = filtered.filter(car => 
        car.color.toLowerCase().includes(selectedColor.toLowerCase())
      );
    }
    
    filtered = filtered.filter(car => car.seats >= selectedSeats);
    filtered = filtered.filter(car => car.price <= selectedPrice);
    
    return filtered;
  };

  // Reset filters function
  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedTransmission("");
    setSelectedColor("");
    setSelectedSeats(2);
    setSelectedPrice(1000);
    
    // Reset to original data
    fetchCars();
  };

  const filteredCars = applyFilters();

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
                      <option value="">All Brands</option>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand}>
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
                      <option value="">All Models</option>
                      {models.map((model, index) => (
                        <option key={index} value={model}>
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
                      <option value="">All Transmissions</option>
                      {transmissions.map((transmission, index) => (
                        <option key={index} value={transmission}>
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
                      <option value="">All Colors</option>
                      {colors.map((color, index) => (
                        <option key={index} value={color}>
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

            {/* Car Cards */}
            <Col lg="9">
              {loading ? (
                <div className="text-center">
                  <Spinner color="primary" />
                  <p>Loading cars...</p>
                </div>
              ) : error ? (
                <div className="text-center text-danger">
                  <p>{error}</p>
                  <Button color="primary" onClick={fetchCars}>
                    Retry
                  </Button>
                </div>
              ) : (
                <Row>
                  {filteredCars.length === 0 ? (
                    <Col lg="12">
                      <p className="no-cars-text">No cars match your filters.</p>
                    </Col>
                  ) : (
                    filteredCars.map((item) => (
                      <Col lg="4" md="6" sm="12" className="mb-4" key={item.id || item._id}>
                        <CarItem2 item={item} type={item.type || "car"} />
                      </Col>
                    ))
                  )}
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </Helmet>
  );
};

export default CarListing2;