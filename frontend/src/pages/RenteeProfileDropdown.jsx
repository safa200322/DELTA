import React, { useState, useRef, useEffect } from "react";
import "../styles/profile-dropdown.css";
import { Link } from "react-router-dom";

const RenteeProfileIconDropdown = () => {
  const [open, setOpen] = useState(false);
  const iconRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (iconRef.current && !iconRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown-wrapper" ref={iconRef}>
      <i
        className="ri-user-3-fill profile-header-icon"
        onClick={() => setOpen(!open)}
        title="Profile"
      ></i>

      {open && (
        <div className="dropdown-menu-box show">
          {/* <p className="signin-title">Sign In / Register</p> */}
          <ul className="menu-list">
            <li>
              <Link to="/profile/rentee-profile">My Profile</Link>
            </li>
            <li>
              <Link to="/profile/rentee-vehicle-management">
                Vehicle Management
              </Link>
            </li>
            <li>
              <Link to="/profile/rentee-earnings-and-payments">
                Earnings & Payments
              </Link>
            </li>
            <li>
              <Link to="/profile/rentee-rental-reservations">
                Incoming Reservations
              </Link>
            </li>
            <li>
              <Link to="/profile/rentee-notifications">
                Recent Notifications
              </Link>
            </li>
            <li>
              <Link to="/profile/rentee-security">Account Settings</Link>
            </li>
            <li>
              <Link to="/profile/rentee-maintenance-and-documents">
                Maintenance & Documents
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RenteeProfileIconDropdown;
