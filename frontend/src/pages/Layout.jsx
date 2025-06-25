import React from "react";
import { Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admin-dashboard.css";

const Layout = () => {
  return (
    <div className="dashboard-wrapper d-flex">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header text-center p-3">
          <img
            src="https://placehold.co/40x40/667fff/ffffff.png?text=L"
            alt="Logo"
            className="mb-2"
          />
        </div>
        <ul className="nav flex-column sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/" end>
              <span className="sidebar-icon">📊</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/orders">
              <span className="sidebar-icon">📦</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/customers">
              <span className="sidebar-icon">👥</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/products">
              <span className="sidebar-icon">🛍️</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/reports">
              <span className="sidebar-icon">📈</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/vehicle-management">
              <span className="sidebar-icon">🚗</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/settings">
              <span className="sidebar-icon">⚙️</span>
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer text-center p-3">
          <img
            src="https://placehold.co/40x40/cccccc/ffffff.png?text=JD"
            alt="Profile"
            className="rounded-circle mb-2"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main-content flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
