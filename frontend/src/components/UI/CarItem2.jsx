import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/car-item.css";

const CarItem2 = ({ item, type }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Multiple fallback options
  const fallbackImages = [
    "https://via.placeholder.com/400x200/f0f0f0/666666?text=Car+Image",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23f0f0f0'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='.3em' fill='%23666' font-family='Arial' font-size='16'%3ECar Image%3C/text%3E%3C/svg%3E",
    "https://dummyimage.com/400x200/f0f0f0/666666.png&text=Car+Image"
  ];
  
  const [fallbackIndex, setFallbackIndex] = useState(0);
  
  // Get current fallback image
  const fallbackImage = fallbackImages[fallbackIndex] || fallbackImages[1]; // SVG as ultimate fallback

  useEffect(() => {
    console.log("🧩 CarItem props:", item);
    console.log("🖼️ Image URL used:", item?.imgUrl);
    
    // Reset states when item changes
    setImageError(false);
    setIsLoading(true);
    setFallbackIndex(0);
  }, [item]);

  const handleImageLoad = () => {
    console.log("✅ Image loaded successfully:", item?.imgUrl);
    setIsLoading(false);
  };

  const handleImageError = (e) => {
    console.error("❌ Failed to load image:", e.target.src);
    console.error("Error details:", e);
    
    // Try next fallback image
    if (fallbackIndex < fallbackImages.length - 1) {
      console.log(`🔄 Trying fallback image ${fallbackIndex + 1}`);
      setFallbackIndex(prev => prev + 1);
      e.target.src = fallbackImages[fallbackIndex + 1];
    } else {
      console.error("❌ All fallback images failed!");
      setImageError(true);
      setIsLoading(false);
      // Use inline SVG as last resort
      e.target.src = fallbackImages[1];
    }
  };

  // Function to validate and clean image URL
  const getValidImageUrl = (url) => {
    if (!url) return fallbackImage;
    
    // Check if it's a valid URL format
    try {
      new URL(url);
      return url;
    } catch {
      // If it's a relative path, you might need to prepend your base URL
      // return `${process.env.REACT_APP_BASE_URL}${url}`;
      console.warn("Invalid URL format:", url);
      return fallbackImage;
    }
  };

  const imageUrl = getValidImageUrl(item?.imgUrl);

  return (
    <Col lg="12" className="mb-4">
      <div className="car__item">
        <div className="car__item-img" style={{ position: "relative" }}>
          {isLoading && !imageError && (
            <div 
              className="image-loading"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1
              }}
            >
              Loading...
            </div>
          )}
          
          <img
            src={imageUrl}
            alt={item?.model || "Car Image"}
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
            <div 
              className="image-placeholder"
              style={{
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
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🚗</div>
              <div style={{ fontSize: "14px" }}>Car Image Not Available</div>
            </div>
          )}
          
          <span className="car-type-badge">
            {type ? type.toUpperCase() : "CAR"}
          </span>
        </div>
        
        <div className="car__item-content">
          <h4 className="car__item-title">{item?.carName || item?.model}</h4>
          
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
              <i className="ri-car-line"></i> {item?.automatic || "Automatic"}
            </span>
            <span className="detail-item">
              <i className="ri-timer-flash-line"></i> {item?.speed || "220 km/h"}
            </span>
            <span className="detail-item">
              <i className="ri-map-pin-line"></i> {item?.gps || "GPS Enabled"}
            </span>
          </div>
          
          <div className="car__item-rating">
            <span className="rating-value">{item?.rating || "4.7"}</span>
            <span className="rating-text">
              Excellent ({item?.reviews || "188"} reviews)
            </span>
          </div>
          
          <div className="car__item-price">
            <span className="original-price">
              ${item?.originalPrice || "250"}
            </span>
            <span className="current-price">${item?.price}/day</span>
          </div>
          
          <button className="car__item-btn book-btn">
            <Link to={`/cars/${item.slug}`}>Book</Link>

          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem2;