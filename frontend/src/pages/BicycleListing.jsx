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
import Footer from "../components/Footer/Footer";
import BicycleItem from "../components/UI/BicycleItem";
import VehicleSkeletonItem from "../components/UI/VehicleSkeletonItem";
import "../styles/car-listing.css";
import "../styles/skeleton.css";

const BicycleListing = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allBicycles, setAllBicycles] = useState([]);
  const [sortedBicycles, setSortedBicycles] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Filter states
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(100); // Default max price

  // Fetch bicycles data from the backend API
  useEffect(() => {
    const fetchBicycles = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch(
          "http://localhost:5000/api/bicycles/filterbicycle"
        );
        const data = await response.json();
        setAllBicycles(data);
        setSortedBicycles(data);
      } catch (error) {
        console.error("Error fetching bicycles:", error);
      } finally {
        setIsLoading(false); // End loading regardless of result
      }
    };

    fetchBicycles();
  }, []);

  const { types, maxPrice } = useMemo(() => {
    // Filter out undefined values and use only available fields
    const types = [...new Set(allBicycles.map((b) => b.Type).filter(Boolean))].sort();
    const maxPrice = Math.max(...allBicycles.map((b) => b.Price || 0), 100);
    return { types, maxPrice };
  }, [allBicycles]);

  useEffect(() => {
    setSelectedPrice(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    let filtered = [...allBicycles];
    if (selectedType) {
      filtered = filtered.filter((b) => b.Type && b.Type.toLowerCase() === selectedType.toLowerCase());
    }
    if (selectedPrice < maxPrice) {
      filtered = filtered.filter((b) => b.Price <= selectedPrice);
    }
    setSortedBicycles(filtered);
  }, [selectedType, selectedPrice, allBicycles, maxPrice]);

  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);

  const handleResetFilters = () => {
    setSelectedType("");
    setSelectedPrice(maxPrice);
    setSortedBicycles(allBicycles);
  };

  return (
    <Helmet title="Bicycles">
      <CommonSection title="Bicycles Listing" />
      <section className="car-listing-section">
        <Container>
          <Row className="mb-4">
            <Col lg="12">
              <div className="car-listing-controls d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="filter-toggle-mobile d-lg-none">
                  <Button color="primary" onClick={toggleFilterPanel} className="filter-toggle-btn">
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

                  <div className="filter-group">
                    <label className="filter-label">Price ($/day)</label>
                    <div className="price-range-inputs">
                      <input
                        type="range"
                        className="price-slider"
                        min={0}
                        max={maxPrice}
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(parseInt(e.target.value))}
                      />
                      <span className="price-range-value">0 - {selectedPrice}</span>
                    </div>
                  </div>

                  <div className="filter-group text-center">
                    <Button color="secondary" onClick={handleResetFilters} className="w-100">
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </Collapse>
            </Col>

            <Col lg="9">
              <Row>
                {isLoading ? (
                  // Show skeletons while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={index}>
                      <VehicleSkeletonItem />
                    </Col>
                  ))
                ) : sortedBicycles.length > 0 ? (
                  sortedBicycles.map((item) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.VehicleID}>
                      <BicycleItem item={item} />
                    </Col>
                  ))
                ) : (
                  <Col lg="12" className="text-center">
                    <p>No bicycles found.</p>
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

export default BicycleListing;
