import React, { useRef, useEffect } from "react";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import "../../styles/header.css";
import "remixicon/fonts/remixicon.css";

const publicNavLinks = [
  { path: "/home", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/cars", display: "Cars" },
  { path: "/motorcycles", display: "Motorcycles" },
  { path: "/bicycle", display: "Bicycles" },
  { path: "/boats", display: "Boats" },
  { path: "/contact", display: "Contact" },
];

const authNavLinks = [
  { path: "/signup", display: "SignUp" },
  { path: "/login", display: "Login" },
];

const Header = () => {
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userType, setUserType] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const type = localStorage.getItem("userType");
      setIsAuthenticated(!!token);
      setUserType(type);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location]);

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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserType(null);
    window.location.href = '/login';
  };

  // Only show public links; do not show auth links if authenticated
  let navLinksToShow = [...publicNavLinks];
  if (!isAuthenticated) {
    navLinksToShow = [...publicNavLinks, ...authNavLinks];
  }
  navLinksToShow.push({ path: "/apply-chauffeur", display: "Apply as Chauffeur" });

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
                {navLinksToShow.map((item, index) => (
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

            {isAuthenticated && (
              <>
                <Link to="/notifications" className="profile__icon" title="Notifications">
                  <i className="ri-notification-3-fill" style={{ color: "#EF3E3F" }}></i>
                </Link>

                {/* Show profile options based on user type */}
                {userType === 'user' && (
                  <Link to="/profile/ProfileOverview" className="profile__icon" title="User Profile">
                    <i className="ri-user-3-fill" style={{ color: "#007bff" }}></i>
                  </Link>
                )}

                {userType === 'chauffeur' && (
                  <Link to="/profile/personal-info" className="profile__icon" title="Chauffeur Profile">
                    <i className="ri-steering-2-fill" style={{ color: "#28a745" }}></i>
                  </Link>
                )}

                {userType === 'vehicle-owner' && (
                  <Link to="/profile/rentee-profile" className="profile__icon" title="Vehicle Owner Profile">
                    <i className="ri-car-fill" style={{ color: "#F88D56" }}></i>
                  </Link>
                )}

                {userType === 'admin' && (
                  <Link to="/admin" className="profile__icon" title="Admin Profile">
                    <i className="ri-user-2-fill" style={{ color: "#EBC222" }}></i>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="profile__icon"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  title="Logout"
                >
                  <i className="ri-logout-box-line" style={{ color: "#dc3545" }}></i>
                </button>
              </>
            )}
          </Col>
        </Row>

        {/* Mobile Navigation */}
        <Row className="d-md-none">
          <Col xs="12">
            <Nav className="navigation mobile__nav" ref={navRef}>
              <div className="menu">
                {navLinksToShow.map((item, index) => (
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
