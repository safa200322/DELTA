import React from "react";
import { NavLink } from "react-router-dom";
import { Col, Nav, NavItem } from "reactstrap";

const RenteeSidebar = ({ 
  sidebarOpen, 
  toggleSidebar, 
  title = "Rentee Profile",
  customNavItems = null 
}) => {
  const defaultNavItems = [
    {
      to: "/profile/rentee-profile",
      icon: "ri-user-line",
      label: "Personal Info"
    },
    {
      to: "/profile/rentee-vehicle-management",
      icon: "ri-briefcase-line",
      label: "Vehicle Management"
    },
    {
      to: "/profile/rentee-rental-reservations",
      icon: "ri-calendar-line",
      label: "Rental reservations"
    },
    {
      to: "/profile/rentee-earnings-and-payments",
      icon: "ri-file-text-line",
      label: "Earnings & Payments"
    },
    {
      to: "/profile/rentee-notifications",
      icon: "ri-notification-line",
      label: "Notifications"
    },
    {
      to: "/profile/rentee-security",
      icon: "ri-shield-line",
      label: "Security"
    }
  ];

  const navItems = customNavItems || defaultNavItems;

  return (
    <Col
      xs="12"
      md="3"
      lg="2"
      className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
    >
      <div className="sidebar-header">
        <h3>{title}</h3>
        <i
          className="ri-menu-line sidebar-toggle d-md-none"
          onClick={toggleSidebar}
        ></i>
      </div>
      <Nav vertical className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavItem key={index}>
            <NavLink to={item.to} className="nav-link">
              <i className={item.icon}></i> {item.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </Col>
  );
};

export default RenteeSidebar;
