import React, { useState, useRef, useEffect } from "react";
import "../styles/profile-dropdown.css";
import { Link } from "react-router-dom";

const ProfileIconDropdown = () => {
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
          <ul className="menu-list">
            <li>
              <Link
                to={
                  localStorage.getItem("OwnerID")
                    ? {
                        pathname: "/userprofileowner",
                        state: { OwnerID: localStorage.getItem("OwnerID") },
                      }
                    : "/profile/rentee-profile"
                }
              >
                My Profile
              </Link>
            </li>
            <li>Vehicle Management</li>
            <li>Earnings & Payments</li>
            <li>Incoming Reservations</li>
            <li>Recent Notifications</li>
            <li>Account Settings</li>
            <li>Maintenance & Documents</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileIconDropdown;
