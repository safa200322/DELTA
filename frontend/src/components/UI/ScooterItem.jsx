import React from "react";
import { Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const ScooterItem = ({ item, type }) => {
  const navigate = useNavigate();

  const handleBook = (id) => {
    navigate(`/bicycle/${id}`);
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img">
          <img src={item.image_url} alt={item.model} className="w-100" />
          <span className="car-type-badge">{type?.toUpperCase() || item.bicycle_type}</span>
        </div>

        <div className="car__item-content">
          <h4 className="car__item-title">{item.brand} {item.model}</h4>

          <div className="car__item-features">
            <span className="feature-item">
              <i className="ri-checkbox-circle-line"></i> Free Cancellation
            </span>
            <span className="feature-item">
              <i className="ri-checkbox-circle-line"></i> Eco Friendly
            </span>
          </div>

          <div className="car__item-details">
            <span className="detail-item">
              <i className="ri-car-line"></i> {item.frame_material || "N/A"}
            </span>
            <span className="detail-item">
              <i className="ri-timer-flash-line"></i> {item.wheel_size || "N/A"}
            </span>
            <span className="detail-item">
              <i className="ri-map-pin-line"></i> {item.brake_type || "N/A"}
            </span>
          </div>

          <div className="car__item-price">
            <span className="current-price">${item.price_per_day}/day</span>
          </div>

          <button className="car__item-btn book-btn" onClick={() => handleBook(item.vehicle_id)}>
            Book
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ScooterItem;
