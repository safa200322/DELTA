import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/car-item.css";

const BicycleItem = ({ item, type }) => {
  const navigate = useNavigate();

  const handleBook = (id) => {
    navigate(`/bicycle/${id}`);
  };

  return (
    <div className="car__item">
      <div className="car__item-img">
        <img src={item.VehiclePic || "https://placehold.co/300x200?text=Image+Not+Available"} alt={item.Type || "Bicycle"} className="w-100" />
        <span className="car-type-badge">{item.Type?.toUpperCase() || "BICYCLE"}</span>
      </div>

      <div className="car__item-content">
        <h4 className="car__item-title">{item.Type || "Bicycle"}</h4>

        <div className="car__item-info d-flex justify-content-between mt-3">
          <span className="d-flex align-items-center gap-1">
            <i className="ri-settings-2-line"></i> {item.Gears || 0} Gears
          </span>
          <span className="d-flex align-items-center gap-1">
            <i className="ri-map-pin-line"></i> {item.Location}
          </span>
        </div>

        <div className="car__item-price">
          <span className="current-price">${item.Price}/day</span>
        </div>

        <button className="car__item-btn book-btn" onClick={() => handleBook(item.VehicleID)}>
          Book
        </button>
      </div>
    </div>
  );
};

export default BicycleItem;
