import React, { useEffect, useState, useMemo } from "react";
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
import VehicleSkeletonItem from "../components/UI/VehicleSkeletonItem";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";
import "../styles/skeleton.css";
import { useLocation, useSearchParams } from "react-router-dom";

const CarListing = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allCars, setAllCars] = useState([]); // Store all fetched cars
  const [sortedCars, setSortedCars] = useState([]); // Cars to be displayed after sorting/filtering
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // State to hold selected filter values
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(""); // Changed to string for 'Select' option
  const [selectedPrice, setSelectedPrice] = useState(1000); // Default max price

  // Extract pickup/dropoff datetimes from URL params and store in localStorage
  useEffect(() => {
    const departDate = searchParams.get("depart");
    const returnDate = searchParams.get("return");

    if (departDate) {
      localStorage.setItem("pickupDateTime", departDate);
    }
    if (returnDate) {
      localStorage.setItem("dropoffDateTime", returnDate);
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch car data from backend
    const fetchCars = async () => {
      setIsLoading(true); // Start loading
      try {
        let url = "http://localhost:5000/api/vehicles/filter";
        if (location.search) {
          url += location.search;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setAllCars(data); // Store all cars
          setSortedCars(data); // Initially display all cars
        } else {
          setAllCars([]);
          setSortedCars([]);
        }
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        setAllCars([]);
        setSortedCars([]);
      } finally {
        setIsLoading(false); // End loading regardless of result
      }
    };
    fetchCars();
  }, [location.search]); // Refetch when search params change

  // Memoize filter options to avoid recalculating on every render
  const { brands, models, transmissions, colors, seatOptions, maxPrice } =
    useMemo(() => {
      const brands = [...new Set(allCars.map((car) => car.Brand))].sort();
      const models = [...new Set(allCars.map((car) => car.Model))].sort();
      const transmissions = [
        ...new Set(allCars.map((car) => car.Transmission)),
      ].sort();
      const colors = [...new Set(allCars.map((car) => car.Color))].sort();
      const seatOptions = [
        ...new Set(allCars.map((car) => car.Seats)),
      ].sort((a, b) => a - b);
      const maxPrice = Math.max(...allCars.map((car) => car.Price), 1000);
      return { brands, models, transmissions, colors, seatOptions, maxPrice };
    }, [allCars]);

    useEffect(() => {
      setSelectedPrice(maxPrice);
    }, [maxPrice]);


  // useEffect to apply filters when filter states change
  useEffect(() => {
    let filtered = [...allCars];

    if (selectedBrand) {
      filtered = filtered.filter(
        (car) => car.Brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    if (selectedModel) {
      filtered = filtered.filter(
        (car) => car.Model.toLowerCase() === selectedModel.toLowerCase()
      );
    }
    if (selectedTransmission) {
      filtered = filtered.filter(
        (car) =>
          car.Transmission.toLowerCase() === selectedTransmission.toLowerCase()
      );
    }
    if (selectedColor) {
      filtered = filtered.filter(
        (car) => car.Color.toLowerCase() === selectedColor.toLowerCase()
      );
    }
    if (selectedSeats) {
      filtered = filtered.filter(
        (car) => car.Seats === parseInt(selectedSeats)
      );
    }
    if (selectedPrice < maxPrice) {
        filtered = filtered.filter((car) => car.Price <= selectedPrice);
    }


    setSortedCars(filtered);
  }, [
    selectedBrand,
    selectedModel,
    selectedTransmission,
    selectedColor,
    selectedSeats,
    selectedPrice,
    allCars,
    maxPrice
  ]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedTransmission("");
    setSelectedColor("");
    setSelectedSeats("");
    setSelectedPrice(maxPrice);
    setSortedCars(allCars); // Reset to all cars
  };

  return (
    <Helmet title="Cars">
      <CommonSection title="Car Listing" />

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

                  {/* Model Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Model</label>
                    <select
                      className="filter-dropdown"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option value="">Select Model</option>
                      {models.map((model, index) => (
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

                  {/* Seats Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Seats</label>
                    <select
                      className="filter-dropdown"
                      value={selectedSeats}
                      onChange={(e) => setSelectedSeats(e.target.value)}
                    >
                      <option value="">Select Seats</option>
                      {seatOptions.map((seats, index) => (
                        <option key={index} value={seats}>
                          {seats}
                        </option>
                      ))}
                    </select>
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
                      {transmissions.map((trans, index) => (
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

            {/* Car Cards Column */}
            <Col lg="9">
              <Row>
                {isLoading ? (
                  // Show skeletons while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={index}>
                      <VehicleSkeletonItem />
                    </Col>
                  ))
                ) : sortedCars.length === 0 ? (
                  <Col lg="12">
                    <p className="no-cars-text">No cars available.</p>
                  </Col>
                ) : (
                  sortedCars.map((item, index) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.VehicleID || item.id || item.ID || index}>
                      <CarItem
                        item={item}
                        type={item.type || "car"}
                      />
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
