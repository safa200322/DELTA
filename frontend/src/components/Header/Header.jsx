import React, { useRef, useEffect } from "react";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import "../../styles/header.css";
import "remixicon/fonts/remixicon.css";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/cars", display: "Cars" },
  { path: "/motors", display: "Motors" },
  { path: "/bicycle", display: "Bicycles" },
  { path: "/boats", display: "Boats" },
  { path: "/contact", display: "Contact" },
  { path: "/signup", display: "SignUp" },
  { path: "/login", display: "Login" },
  { path: "/apply-chauffeur", display: "Apply as Chauffeur" },
];

const Header = () => {
  const menuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        menuRef.current.classList.add("sticky__header");
      } else {
        menuRef.current.classList.remove("sticky__header");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    navRef.current.classList.toggle("menu__active");
  };

  return (
    <header className="header" ref={menuRef}>
      <Container>
        <Row className="align-items-center">
          <Col xs="6" md="2" lg="2">
            <div className="header__branding">
              <Link to="/home" className="d-flex align-items-center gap-2">
                <i className="ri-car-line"></i>
                <h1 className="header__title mb-0">Vehicles for Delta</h1>
              </Link>
            </div>
          </Col>

          <Col xs="6" md="5" lg="6" className="d-flex align-items-center">
            <span className="mobile__menu d-md-none">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
            <Nav className="navigation d-none d-md-flex" ref={navRef}>
              <div className="menu d-flex gap-3">
                {navLinks.map((item, index) => (
                  <NavItem key={index}>
                    <RouterNavLink to={item.path} className={({ isActive }) => (isActive ? "nav__active nav__item" : "nav__item")}>
                      {item.display}
                    </RouterNavLink>
                  </NavItem>
                ))}
              </div>
            </Nav>
          </Col>

          <Col xs="12" md="5" lg="4" className="d-flex align-items-center justify-content-end gap-2">
            <div className="search__box">
              <input type="text" placeholder="Search" />
              <span>
                <i className="ri-search-line"></i>
              </span>
            </div>

            <Link to="/notifications" className="profile__icon" title="Notifications">
              <i className="ri-notification-3-fill" style={{ color: "#EF3E3F" }}></i>
            </Link>
            <Link to="/profile/ProfileOverview" className="profile__icon" title="User Profile">
              <i className="ri-user-3-fill" style={{ color: "#007bff" }}></i>
            </Link>
            <Link to="/profile/personal-info" className="profile__icon" title="Chauffeur Profile">
              <i className="ri-steering-2-fill" style={{ color: "#28a745" }}></i>
            </Link>
            <Link to="/profile/rentee-profile" className="profile__icon" title="Rentee Profile">
              <i className="ri-car-fill" style={{ color: "#F88D56" }}></i>
            </Link>
            <Link to="/admin" className="profile__icon" title="Admin Profile">
              <i className="ri-user-2-fill" style={{ color: "#EBC222" }}></i>
            </Link>
          </Col>
        </Row>

        {/* Mobile Navigation */}
        <Row className="d-md-none">
          <Col xs="12">
            <Nav className="navigation mobile__nav" ref={navRef}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavItem key={index}>
                    <RouterNavLink to={item.path} className={({ isActive }) => (isActive ? "nav__active nav__item" : "nav__item")} onClick={toggleMenu}>
                      {item.display}
                    </RouterNavLink>
                  </NavItem>
                ))}
              </div>
            </Nav>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
