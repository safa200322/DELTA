import React, { useRef, useEffect, useState } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const location = useLocation();

  useEffect(() => {
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
    <header
      className="header"
      ref={menuRef}
      style={{
        boxShadow: '0 2px 16px 0 #0001',
        zIndex: 100,
        background: '#256489',
        color: '#fff',
        fontFamily: 'Inter, Arial, sans-serif',
        letterSpacing: 0.1,
        fontWeight: 500,
        minHeight: 72,
      }}
      aria-label="Main site header"
    >
      <Container fluid style={{ maxWidth: 1440, padding: '0 32px' }}>
        <Row className="align-items-center" style={{ minHeight: 72 }}>
          {/* Branding */}
          <Col xs="12" md="2" lg="2" className="d-flex align-items-center" style={{ minWidth: 180 }}>
            <Link
              to="/home"
              className="d-flex align-items-center gap-2"
              style={{ textDecoration: 'none', color: '#fff' }}
              aria-label="Go to home page"
            >
              <i className="ri-car-line" style={{ fontSize: 32, color: '#fff' }}></i>
              <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.5, color: '#fff', fontFamily: 'Inter, Arial, sans-serif' }}>
                Vehicles for Delta
              </span>
            </Link>
          </Col>

          {/* Navigation */}
          <Col xs="12" md="7" lg="7" className="d-none d-md-flex align-items-center justify-content-center" style={{ height: 72 }}>
            <Nav className="navigation" ref={navRef} style={{ gap: 8 }} aria-label="Main navigation">
              <div className="menu d-flex gap-2" style={{ alignItems: 'center' }}>
                {navLinksToShow.map((item, index) => (
                  <NavItem key={index} style={{ margin: '0 2px' }}>
                    <RouterNavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "nav__active nav__item" : "nav__item"
                      }
                      style={({ isActive }) => ({
                        fontWeight: isActive ? 700 : 500,
                        fontSize: 16,
                        color: '#fff',
                        background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                        borderRadius: 8,
                        padding: '8px 18px',
                        transition: 'all 0.18s',
                        letterSpacing: 0.1,
                        textDecoration: 'none',
                        boxShadow: isActive ? '0 2px 8px #fff1' : 'none',
                        border: isActive ? '1.5px solid #fff2' : '1.5px solid transparent',
                        display: 'inline-block',
                        outline: isActive ? '2px solid #fff' : 'none',
                      })}
                      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                    >
                      {item.display}
                    </RouterNavLink>
                  </NavItem>
                ))}
              </div>
            </Nav>
          </Col>

          {/* User Actions */}
          <Col xs="12" md="3" lg="3" className="d-flex align-items-center justify-content-end gap-2" style={{ minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, borderLeft: '1.5px solid #fff3', paddingLeft: 24, height: 48 }}>
              {isAuthenticated && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  {userType === 'user' &&
                    <Link to="/profile/ProfileOverview" className="profile__icon" title="User Profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.10)', transition: 'background 0.18s' }}>
                      <i className="ri-user-3-fill" style={{ color: "#fff", fontSize: 22 }}></i>
                    </Link>
                  }
                  {userType === 'chauffeur' &&
                    <Link to="/chauffeur/dashboard" className="profile__icon" title="Chauffeur Profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.10)', transition: 'background 0.18s' }}>
                      <i className="ri-steering-2-fill" style={{ color: "#fff", fontSize: 22 }}></i>
                    </Link>
                  }
                  {userType === 'vehicle-owner' &&
                    <Link to="/profile/rentee-profile" className="profile__icon" title="Rentee Profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.10)', transition: 'background 0.18s' }}>
                      <i className="ri-car-fill" style={{ color: "#fff", fontSize: 22 }}></i>
                    </Link>
                  }
                  {userType === 'admin' &&
                    <Link to="/admin" className="profile__icon" title="Admin Profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.10)', transition: 'background 0.18s' }}>
                      <i className="ri-user-2-fill" style={{ color: "#fff", fontSize: 22 }}></i>
                    </Link>
                  }
                  <button
                    onClick={handleLogout}
                    className="profile__icon"
                    style={{
                      background: 'rgba(255,255,255,0.10)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      transition: 'background 0.18s',
                    }}
                    title="Logout"
                    aria-label="Logout"
                  >
                    <i className="ri-logout-box-line" style={{ color: "#fff", fontSize: 22 }}></i>
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Mobile Navigation */}
        <Row className="d-md-none">
          <Col xs="12">
            <Nav className="navigation mobile__nav" ref={navRef} style={{ marginTop: 8 }} aria-label="Mobile navigation">
              <div className="menu" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinksToShow.map((item, index) => (
                  <NavItem key={index} style={{ margin: '2px 0' }}>
                    <RouterNavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? "nav__active nav__item" : "nav__item"
                      }
                      onClick={toggleMenu}
                      style={({ isActive }) => ({
                        fontWeight: isActive ? 700 : 500,
                        fontSize: 18,
                        color: '#fff',
                        background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                        borderRadius: 8,
                        padding: '12px 18px',
                        transition: 'all 0.18s',
                        letterSpacing: 0.1,
                        textDecoration: 'none',
                        boxShadow: isActive ? '0 2px 8px #fff1' : 'none',
                        border: isActive ? '1.5px solid #fff2' : '1.5px solid transparent',
                        display: 'inline-block',
                        outline: isActive ? '2px solid #fff' : 'none',
                      })}
                      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                    >
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
