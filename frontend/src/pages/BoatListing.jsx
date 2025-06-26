import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse, Button } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import BoatItem from "../components/UI/BoatItem";
import VehicleSkeletonItem from "../components/UI/VehicleSkeletonItem";
import Footer from "../components/Footer/Footer";
import "../styles/car-listing.css";
import "../styles/skeleton.css";

const BoatListing = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allBoats, setAllBoats] = useState([]);
  const [displayedBoats, setDisplayedBoats] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  
  // Filter states
  const [selectedPrice, setSelectedPrice] = useState(1000);
  const [selectedCapacity, setSelectedCapacity] = useState(20);
  const [selectedBoatType, setSelectedBoatType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedEngineType, setSelectedEngineType] = useState("");

  // Fetch all boats from backend on mount
  useEffect(() => {
    const fetchBoats = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("http://localhost:5000/api/boats/filter");
        if (response.ok) {
          const data = await response.json();
          setAllBoats(data);
          setDisplayedBoats(data);
        } else {
          setAllBoats([]);
          setDisplayedBoats([]);
        }
      } catch (error) {
        console.error("Error fetching boats:", error);
        setAllBoats([]);
        setDisplayedBoats([]);
      } finally {
        setIsLoading(false); // End loading regardless of result
      }
    };
    fetchBoats();
  }, []);

  // Derive filter options from data
  const { boatTypes, brands, engineTypes, maxPrice, maxCapacity } = useMemo(() => {
    const boatTypes = [...new Set(allBoats.map(boat => boat.BoatType).filter(Boolean))].sort();
    const brands = [...new Set(allBoats.map(boat => boat.Brand).filter(Boolean))].sort();
    const engineTypes = [...new Set(allBoats.map(boat => boat.EngineType).filter(Boolean))].sort();
    const maxPrice = Math.max(...allBoats.map(boat => boat.Price || 0), 1000);
    const maxCapacity = Math.max(...allBoats.map(boat => boat.Capacity || 0), 20);
    return { boatTypes, brands, engineTypes, maxPrice, maxCapacity };
  }, [allBoats]);

  // Update max values when data loads
  useEffect(() => {
    setSelectedPrice(maxPrice);
    setSelectedCapacity(maxCapacity);
  }, [maxPrice, maxCapacity]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allBoats];
    
    if (selectedBoatType) {
      filtered = filtered.filter(boat => 
        boat.BoatType && boat.BoatType.toLowerCase() === selectedBoatType.toLowerCase());
    }
    
    if (selectedBrand) {
      filtered = filtered.filter(boat => 
        boat.Brand && boat.Brand.toLowerCase() === selectedBrand.toLowerCase());
    }
    
    if (selectedEngineType) {
      filtered = filtered.filter(boat => 
        boat.EngineType && boat.EngineType.toLowerCase() === selectedEngineType.toLowerCase());
    }
    
    if (selectedCapacity < maxCapacity) {
      filtered = filtered.filter(boat => boat.Capacity <= selectedCapacity);
    }
    
    if (selectedPrice < maxPrice) {
      filtered = filtered.filter(boat => boat.Price <= selectedPrice);
    }

    setDisplayedBoats(filtered);
  }, [selectedBoatType, selectedBrand, selectedEngineType, selectedCapacity, selectedPrice, allBoats, maxCapacity, maxPrice]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleFilterPanel = () => setIsFilterOpen((prev) => !prev);
  
  const handleResetFilters = () => {
    setSelectedPrice(maxPrice);
    setSelectedCapacity(maxCapacity);
    setSelectedBoatType("");
    setSelectedBrand("");
    setSelectedEngineType("");
    setDisplayedBoats(allBoats);
  };

  return (
    <Helmet title="Boats">
      <CommonSection title="Boat Listing" />
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
              <Collapse isOpen={isFilterOpen} className="d-lg-block filter-panel">
                <div className="filter-panel-content">
                  <h5 className="filter-title">Filters</h5>
                  
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
                      <span className="price-range-value">
                        $0 - ${selectedPrice}
                      </span>
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <label className="filter-label">Capacity (People)</label>
                    <input 
                      type="range" 
                      className="seats-slider" 
                      min={1} 
                      max={maxCapacity} 
                      value={selectedCapacity} 
                      onChange={(e) => setSelectedCapacity(parseInt(e.target.value))} 
                    />
                    <span className="seats-range-value">{selectedCapacity} People</span>
                  </div>
                  
                  <div className="filter-group">
                    <label className="filter-label">Boat Type</label>
                    <select 
                      className="filter-dropdown" 
                      value={selectedBoatType} 
                      onChange={(e) => setSelectedBoatType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {boatTypes.map((type, index) => (
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
                  
                  <div className="filter-group">
                    <label className="filter-label">Engine Type</label>
                    <select 
                      className="filter-dropdown" 
                      value={selectedEngineType} 
                      onChange={(e) => setSelectedEngineType(e.target.value)}
                    >
                      <option value="">Select Engine Type</option>
                      {engineTypes.map((engine, index) => (
                        <option key={index} value={engine.toLowerCase()}>
                          {engine}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Button color="secondary" className="reset-filters-btn" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
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
                ) : displayedBoats.length === 0 ? (
                  <Col lg="12">
                    <p className="no-cars-text">No boats available.</p>
                  </Col>
                ) : (
                  displayedBoats.map((item) => (
                    <Col lg="4" md="6" sm="12" className="mb-4" key={item.VehicleID}>
                      <BoatItem item={item} type="boat" />
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
