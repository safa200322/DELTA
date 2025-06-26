import React from "react";
import { Col } from "reactstrap";
import "../../styles/car-item.css";

const VehicleSkeletonItem = () => {
  return (
    <Col lg="12" className="mb-4">
      <div className="car__item skeleton-item">
        <div className="car__item-img skeleton-img">
          {/* Skeleton for image */}
          <div className="skeleton-pulse"></div>
          <span className="car-type-badge skeleton-badge"></span>
        </div>
        <div className="car__item-content">
          {/* Skeleton for title */}
          <div className="skeleton-title skeleton-pulse"></div>

          {/* Skeleton for info rows */}
          <div className="car__item-info d-flex justify-content-between mt-3">
            <span className="skeleton-detail skeleton-pulse"></span>
            <span className="skeleton-detail skeleton-pulse"></span>
          </div>

          <div className="car__item-info d-flex justify-content-between mt-3">
            <span className="skeleton-detail skeleton-pulse"></span>
            <span className="skeleton-detail skeleton-pulse"></span>
          </div>

          {/* Skeleton for price */}
          <div className="car__item-price">
            <span className="skeleton-price skeleton-pulse"></span>
          </div>

          {/* Skeleton for button */}
          <div className="skeleton-button skeleton-pulse"></div>
        </div>
      </div>
    </Col>
  );
};

export default VehicleSkeletonItem;
