import React from "react";
import { Col, Nav } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem = ({ item, type }) => {
  const navigate = useNavigate();

  // Debug: log the image link for each car item
  console.debug("[CarItem] vehiclepic src:", item.vehiclepic, "for", item.carName || item.model);

  const handleBook = (carName, model) => {
    const itemName = carName || model || item.Model || item.carName;
    navigate(`/cars/${itemName}`);
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img">
          <img src={item.vehiclepic} alt={item.model} className="w-100" />
          <span className="car-type-badge">{type.toUpperCase()}</span>
        </div>
        <div className="car__item-content">
          <h4 className="car__item-title">{item.carName || item.model || item.Model}</h4>
          <div className="car__item-brand-model">
            <span className="brand-text">
              <i className="ri-car-line"></i> {item.brand || item.Brand}
            </span>
            <span className="model-text">
              <i className="ri-roadster-line"></i> {item.model || item.Model}
            </span>
          </div>
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
            <span className="current-price">${typeof item.Price === 'number' ? item.Price : (typeof item.price === 'number' ? item.price : parseInt(item.Price || item.price || 0))}/day</span>
          </div>
          <button className="car__item-btn book-btn" onClick={() => handleBook(item.carName || item.Model, item.model || item.Model)}>
            Book
          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
