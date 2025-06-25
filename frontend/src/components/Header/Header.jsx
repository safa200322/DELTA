import React, { useRef, useEffect, useState } from "react";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import { Link, NavLink as RouterNavLink, useNavigate } from "react-router-dom"; // <-- added useNavigate
import "../../styles/header.css";
import "remixicon/fonts/remixicon.css";
import ProfileIconDropdown from "../../pages/ProfileDropdown";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/cars2", display: "Cars" },
  { path: "/motors2", display: "Motors" },
  { path: "/bicycles", display: "Bicycles" },
  { path: "/watches", display: "Watches" },
  { path: "/contact", display: "Contact" },
  { path: "/signup", display: "SignUp" },
  { path: "/apply-chauffeur", display: "Apply as Chauffeur" },
];

const Header = () => {
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate(); // <-- initialize navigate

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("jwtToken");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const stickyHeaderFunc = () => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        menuRef.current.classList.add("sticky__header");
      } else {
        menuRef.current.classList.remove("sticky__header");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  };

  const toggleMenu = () => {
    if (navRef.current) {
      navRef.current.classList.toggle("menu__active");
    }
  };

  useEffect(() => {
    stickyHeaderFunc();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("vehicleOwnerToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("OwnerID");
    localStorage.removeItem("OwnerName");
    localStorage.removeItem("OwnerEmail");
    localStorage.removeItem("OwnerPhone");
    localStorage.removeItem("VehicleIDs");

    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));

    navigate("/home");  // <-- Navigate to /home after logout
  };

  return (
    <header className="header" ref={menuRef}>
      <Container>
        <Row className="align-items-center">
          {/* Branding */}
          <Col xs="6" md="3" lg="2">
            <div className="header__branding">
              <Link to="/home" className="d-flex align-items-center gap-2">
                <i className="ri-car-line"></i>
                <h1 className="header__title mb-0">
                  Comprehensive Vehicle Rental System
                </h1>
              </Link>
            </div>
          </Col>

          {/* Navigation */}
          <Col xs="6" md="6" lg="7" className="d-flex align-items-center">
            <span className="mobile__menu d-md-none">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
            <Nav className="navigation d-none d-md-flex" ref={navRef}>
              <div className="menu d-flex gap-3">
                {navLinks.map((item, index) => (
                  <NavItem key={index}>
                    <RouterNavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "nav__active nav__item" : "nav__item"
                      }
                    >
                      {item.display}
                    </RouterNavLink>
                  </NavItem>
                ))}

                {!isLoggedIn ? (
                  <NavItem>
                    <RouterNavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "nav__active nav__item" : "nav__item"
                      }
                    >
                      Login
                    </RouterNavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <span
                      className="nav__item"
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </span>
                  </NavItem>
                )}
              </div>
            </Nav>
          </Col>

          {/* Search, Notifications, Profile Icon, and Buttons */}
          <Col
            xs="12"
            md="3"
            lg="3"
            className="d-flex align-items-center justify-content-end gap-2"
          >
            <div className="search__box d-flex align-items-center">
              <input type="text" placeholder="Search" />
              <span>
                <i className="ri-search-line"></i>
              </span>
            </div>
            <Link
              to="/notifications"
              className="notifications__icon"
              title="Notifications"
            >
              <i className="ri-notification-3-fill"></i>
            </Link>
            <ProfileIconDropdown className="notifications__icon" />
          </Col>
        </Row>

        {/* Mobile Navigation */}
        <Row className="d-md-none">
          <Col xs="12">
            <Nav className="navigation mobile__nav" ref={navRef}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavItem key={index}>
                    <RouterNavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "nav__active nav__item" : "nav__item"
                      }
                      onClick={toggleMenu}
                    >
                      {item.display}
                    </RouterNavLink>
                  </NavItem>
                ))}

                {!isLoggedIn ? (
                  <NavItem>
                    <RouterNavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "nav__active nav__item" : "nav__item"
                      }
                      onClick={toggleMenu}
                    >
                      Login
                    </RouterNavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <span
                      className="nav__item"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                    >
                      Logout
                    </span>
                  </NavItem>
                )}
              </div>
            </Nav>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
