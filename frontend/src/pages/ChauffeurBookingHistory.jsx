import React, { useState, useEffect } from "react";
import {
  Nav,
  NavItem,
  NavLink as ReactstrapNavLink,
  TabContent,
  TabPane,
  Spinner,
  Alert
} from "reactstrap";
import "remixicon/fonts/remixicon.css";
import "../styles/booking-history.css";

const ChauffeurBookingHistory = () => {
  const [activeTab, setActiveTab] = useState("past");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pastBookings, setPastBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/chauffeurs/bookings/history", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch booking history");
        const data = await res.json();
        setPastBookings(data.pastBookings || []);
        setUpcomingBookings(data.upcomingBookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const renderBooking = (b, idx, type) => (
    <li key={b.ReservationID || idx} className="booking-item">
      <div className="booking-card">
        <div className="booking-header">
          <span className="booking-id">Booking #{b.ReservationID}</span>
          <span className={`status-badge status-${b.ResponseStatus?.toLowerCase() || 'unknown'}`}>{b.ResponseStatus || 'Unknown'}</span>
        </div>
        <div className="booking-details">
          <div><strong>Renter:</strong> {b.RenterName} ({b.RenterPhone})</div>
          <div><strong>Vehicle:</strong> {b.VehicleDetails} <span className="vehicle-type">[{b.VehicleType}]</span></div>
          <div><strong>Pickup:</strong> {b.PickupLocation} <strong>Dropoff:</strong> {b.DropoffLocation}</div>
          <div><strong>From:</strong> {new Date(b.StartDate).toLocaleString()} <strong>To:</strong> {new Date(b.EndDate).toLocaleString()}</div>
        </div>
        {b.VehiclePic && (
          <div className="vehicle-pic-wrap">
            <img src={b.VehiclePic} alt="Vehicle" className="vehicle-pic" />
          </div>
        )}
      </div>
    </li>
  );

  return (
    <div className="profile-section">
      <h2>Booking History</h2>
      <Nav tabs>
        <NavItem>
          <ReactstrapNavLink
            className={activeTab === "past" ? "active" : ""}
            onClick={() => setActiveTab("past")}
          >
            Past Bookings
          </ReactstrapNavLink>
        </NavItem>
        <NavItem>
          <ReactstrapNavLink
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Bookings
          </ReactstrapNavLink>
        </NavItem>
      </Nav>
      {loading ? (
        <div className="text-center my-4"><Spinner color="primary" /> Loading booking history...</div>
      ) : error ? (
        <Alert color="danger" className="my-3">{error}</Alert>
      ) : (
        <TabContent activeTab={activeTab}>
          <TabPane tabId="past">
            {pastBookings.length === 0 ? (
              <div className="text-muted my-3">No past bookings found.</div>
            ) : (
              <ul className="booking-list">
                {pastBookings.map((b, idx) => renderBooking(b, idx, "past"))}
              </ul>
            )}
          </TabPane>
          <TabPane tabId="upcoming">
            {upcomingBookings.length === 0 ? (
              <div className="text-muted my-3">No upcoming bookings found.</div>
            ) : (
              <ul className="booking-list">
                {upcomingBookings.map((b, idx) => renderBooking(b, idx, "upcoming"))}
              </ul>
            )}
          </TabPane>
        </TabContent>
      )}
    </div>
  );
};

export default ChauffeurBookingHistory;
