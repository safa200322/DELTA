import React from "react";
import { Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const ScooterItem = ({ item, type }) => {
  const navigate = useNavigate();

  const handleBook = (name) => {
    navigate(`/bicycle/${name}`);
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img">
          <img src={item.imgUrl} alt={item.model} className="w-100" />
          <span className="car-type-badge">{type?.toUpperCase() || "SCOOTER"}</span>
        </div>

        <div className="car__item-content">
          <h4 className="car__item-title">{item.carName || item.model}</h4>

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
              <i className="ri-car-line"></i> {item.model || "Electric"}
            </span>
            <span className="detail-item">
              <i className="ri-timer-flash-line"></i> {item.speed || "40 km/h"}
            </span>
            <span className="detail-item">
              <i className="ri-map-pin-line"></i> {item.gps || "No GPS"}
            </span>
          </div>

          <div className="car__item-rating">
            <span className="rating-value">{item.rating || "4.5"}</span>
            <span className="rating-text">Great ({item.reviews || "80"} reviews)</span>
          </div>

          <div className="car__item-price">
            <span className="original-price">${item.originalPrice || "50"}</span>
            <span className="current-price">${item.price || "35"}/day</span>
          </div>

          <button className="car__item-btn book-btn" onClick={() => handleBook(item.carName)}>
            Book
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ScooterItem;
