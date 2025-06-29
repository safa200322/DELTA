import React from "react";
import { Col, Nav } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = ({ item, type }) => {
  const navigate = useNavigate();

  // Debug: log the image link for each car item
  console.debug("[CarItem] vehiclepic src:", item.VehiclePic, "for", item.carName || item.model);

  const handleBook = () => {
    const carId = item.VehicleID || item.id || item.slug;
    if (carId && type) {
      navigate(`/vehicles/${type}/${carId}`);
    }
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img">
          <img src={item.VehiclePic || "https://placehold.co/300x200?text=Image+Not+Available"} alt={item.model} className="w-100" />
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
          <button className="car__item-btn book-btn" onClick={handleBook}>
            Book
          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
