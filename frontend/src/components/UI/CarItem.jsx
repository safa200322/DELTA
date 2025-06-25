import React from "react";
import { Col, Nav } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = ({ item, type }) => {
  const navigate = useNavigate();

  const handleBook = (carName, model) => {
    navigate(`/cars/${carName || model}`);
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img">
          <img src={item.imgUrl} alt={item.model} className="w-100" />
          <span className="car-type-badge">{type.toUpperCase()}</span>
        </div>
        <div className="car__item-content">
          <h4 className="car__item-title">{item.carName || item.model}</h4>
          <div className="car__item-features">
            <span className="feature-item">
              <i className="ri-checkbox-circle-line"></i> Free Cancellation
            </span>
            <span className="feature-item">
              <i className="ri-checkbox-circle-line"></i> Price Guarantee
            </span>
          </div>
          <div className="car__item-details">
            <span className="detail-item">
              <i className="ri-car-line"></i> {item.automatic || "Automatic"}
            </span>
            <span className="detail-item">
              <i className="ri-timer-flash-line"></i> {item.speed || "220 km/h"}
            </span>
            <span className="detail-item">
              <i className="ri-map-pin-line"></i> {item.gps || "GPS Enabled"}
            </span>
          </div>
          <div className="car__item-rating">
            <span className="rating-value">{item.rating || "4.7"}</span>
            <span className="rating-text">Excellent ({item.reviews || "188"} reviews)</span>
          </div>
          <div className="car__item-price">
            <span className="original-price">${item.originalPrice || "250"}</span>
            <span className="current-price">${item.price}/day</span>
          </div>
          <button className="car__item-btn book-btn" onClick={() => handleBook(item.carName, item.model)}>
            Book
          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
