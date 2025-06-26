import React from "react";
import { Col, Nav } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = ({ item, type }) => {
  const navigate = useNavigate();

  // Debug: log the image link for each car item
  console.debug("[CarItem] vehiclepic src:", item.vehiclepic, "for", item.carName || item.model);

  const handleBook = () => {
    const carId = item.VehicleID;
    const state = {};

    // Get datetime values from localStorage
    const pickupDateTime = localStorage.getItem("pickupDateTime");
    const dropoffDateTime = localStorage.getItem("dropoffDateTime");

    if (pickupDateTime) state.pickupDateTime = pickupDateTime;
    if (dropoffDateTime) state.dropoffDateTime = dropoffDateTime;

    // Log what's being passed to navigation
    console.debug("[CarItem] Navigation state:", state);

    if (carId) {
      navigate(`/cars/${carId}`, { state });
    }
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img">
          <img src={item.vehiclepic || "https://placehold.co/300x200?text=Image+Not+Available"} alt={item.model} className="w-100" />
          <span className="car-type-badge">{type.toUpperCase()}</span>
        </div>
        <div className="car__item-content">
          <h4 className="car__item-title">{item.Brand} {item.Model}</h4>
          
          <div className="car__item-info d-flex justify-content-between mt-3">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-gas-station-line"></i> {item.FuelType}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-group-line"></i> {item.Seats}
            </span>
          </div>

          <div className="car__item-info d-flex justify-content-between mt-3">
             <span className="d-flex align-items-center gap-1">
                <i className="ri-calendar-line"></i> {item.Year}
            </span>
            <span className="d-flex align-items-center gap-1">
                <i className="ri-paint-brush-line"></i> {item.Color}
            </span>
          </div>

          <div className="car__item-info d-flex justify-content-between mt-3">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-settings-2-line"></i> {item.Transmission}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {item.Location}
            </span>
          </div>

          <div className="car__item-price">
            <span className="current-price">${typeof item.Price === 'number' ? item.Price : (typeof item.price === 'number' ? item.price : parseInt(item.Price || item.price || 0))}/day</span>
          </div>
          <button
            className="car__item-btn book-btn"
            onClick={handleBook}
            disabled={!item.VehicleID}
          >
            Book
          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
