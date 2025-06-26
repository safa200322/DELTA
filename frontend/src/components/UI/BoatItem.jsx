import React from "react";
import { Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const BoatItem = ({ item, type }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    const boatId = item.VehicleID || item.id || item.slug;
    if (boatId) {
      navigate(`/vehicles/boat/${boatId}`);
    }
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img">
          <img
            src={
              item.VehiclePic ||
              "https://placehold.co/300x200?text=Image+Not+Available"
            }
            alt={item.BoatType || "Boat"}
            className="w-100"
          />
          <span className="car-type-badge">
            {(item.BoatType ? `${item.BoatType.toUpperCase()} BOAT` : type.toUpperCase())}
          </span>
        </div>
        <div className="car__item-content">
          <h4 className="car__item-title">
            {item.Brand} {item.BoatType}
          </h4>

          <div className="car__item-info d-flex justify-content-between mt-3">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-group-line"></i> {item.Capacity || 0} People
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-settings-2-line"></i> {item.EngineType}
            </span>
          </div>

          <div className="car__item-info d-flex justify-content-between mt-3">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {item.Location}
            </span>
          </div>

          <div className="car__item-price">
            <span className="current-price">${item.Price}/day</span>
          </div>

          <button className="car__item-btn book-btn" onClick={handleBook}>
            Book
          </button>
        </div>
      </div>
    </Col>
  );
};

export default BoatItem;
