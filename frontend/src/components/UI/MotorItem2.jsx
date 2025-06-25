import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/motor-item.css";

const MotorItem2 = ({ item, type }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImages = [
    "https://via.placeholder.com/400x200/f0f0f0/666666?text=Motor+Image",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23f0f0f0'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='16'%3EMotor Image%3C/text%3E%3C/svg%3E",
    "https://dummyimage.com/400x200/f0f0f0/666666.png&text=Motor+Image"
  ];

  const [fallbackIndex, setFallbackIndex] = useState(0);
  const fallbackImage = fallbackImages[fallbackIndex] || fallbackImages[1];

  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    setFallbackIndex(0);
  }, [item]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (e) => {
    if (fallbackIndex < fallbackImages.length - 1) {
      setFallbackIndex(prev => {
        const nextIndex = prev + 1;
        e.target.src = fallbackImages[nextIndex];
        return nextIndex;
      });
    } else {
      setImageError(true);
      setIsLoading(false);
      e.target.src = fallbackImages[1]; // fallback to SVG
    }
  };

  const getValidImageUrl = (url) => {
    if (!url) return fallbackImage;
    try {
      new URL(url);
      return url;
    } catch {
      return fallbackImage;
    }
  };

  const imageUrl = getValidImageUrl(item?.imgUrl);

  return (
    <Col lg="12" className="mb-4">
      <div className="motor__item">
        <div className="motor__item-img" style={{ position: "relative" }}>
          {isLoading && !imageError && (
            <div className="image-loading" style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1
            }}>
              Loading...
            </div>
          )}

          <img
            src={imageUrl}
            alt={item?.model || "Motor Image"}
            className="w-100"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              objectFit: "cover",
              height: "200px",
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.3s ease"
            }}
          />

          {imageError && (
            <div className="image-placeholder" style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0f0f0",
              border: "2px dashed #ccc",
              color: "#666"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏍️</div>
              <div style={{ fontSize: "14px" }}>Motor Image Not Available</div>
            </div>
          )}

          <span className="motor-type-badge">
            {type ? type.toUpperCase() : "MOTOR"}
          </span>
        </div>

        <div className="motor__item-content">
          <h4 className="motor__item-title">{item?.motorName || item?.model}</h4>

          <div className="motor__item-features">
            <span className="feature-item">
              <i className="ri-checkbox-circle-line"></i> Free Helmet
            </span>
            <span className="feature-item">
              <i className="ri-checkbox-circle-line"></i> Roadside Assist
            </span>
          </div>

          <div className="motor__item-details">
            <span className="detail-item">
              <i className="ri-motorbike-line"></i> {item?.type || "Standard"}
            </span>
            <span className="detail-item">
              <i className="ri-timer-flash-line"></i> {item?.speed || "140 km/h"}
            </span>
            <span className="detail-item">
              <i className="ri-map-pin-line"></i> {item?.gps || "GPS Included"}
            </span>
          </div>

          <div className="motor__item-rating">
            <span className="rating-value">{item?.rating || "4.6"}</span>
            <span className="rating-text">
              Excellent ({item?.reviews || "75"} reviews)
            </span>
          </div>

          <div className="motor__item-price">
            <span className="original-price">${item?.originalPrice || "100"}</span>
            <span className="current-price">${item?.price}/day</span>
          </div>

          <button className="motor__item-btn book-btn">
            <Link to={`/motors/${item.slug}`}>Book</Link>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default MotorItem2;
