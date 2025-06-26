import React from "react";
import "../../styles/car-item.css";
import { useNavigate } from "react-router-dom";

const MotorItem = ({ item, type }) => {
  const navigate = useNavigate();

  const handleBook = (id) => {
    navigate(`/motorcycles/${id}`);
  };

  return (
    <div className="car__item">
      <div className="car__item-img">
        <img src={item.vehiclepic || "https://placehold.co/300x200?text=Image+Not+Available"} alt={item.Type} className="w-100" />
        <span className="car-type-badge">{item.Type?.toUpperCase()}</span>
      </div>
      <div className="car__item-content">
        <h4 className="car__item-title">{item.Brand} {item.Type}</h4>
        
        <div className="car__item-info d-flex justify-content-between mt-3">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-timer-flash-line"></i> {item.Engine} cc
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-calendar-line"></i> {item.Year}
            </span>
        </div>
        <div className="car__item-info d-flex justify-content-between mt-3">
             <span className="d-flex align-items-center gap-1">
                <i className="ri-paint-brush-line"></i> {item.color}
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

export default MotorItem;
