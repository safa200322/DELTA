import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import "../styles/chauffeur-profile.css";

// Pure section component for profile subpage rendering
const ChauffeurWorkAvailability = () => {
  const [status, setStatus] = useState("Available");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      setActionMsg("");
      try {
        const token = localStorage.getItem("token");
        // Decode JWT to get chauffeurId
        const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
        const chauffeurId = payload && (payload.id || payload.ChauffeurID);
        if (!chauffeurId) throw new Error("Invalid token or chauffeur ID");
        const res = await fetch(
          `http://localhost:5000/api/chauffeurs/assignments/pending/${chauffeurId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [actionMsg]);

  const handleStatusChange = () => {
    setStatus((prev) =>
      prev === "Available"
        ? "Unavailable"
        : prev === "Unavailable"
          ? "On a Job"
          : "Available"
    );
  };

  const handleAssignmentAction = async (reservationId, action) => {
    setError(null);
    setActionMsg("");
    try {
      const token = localStorage.getItem("token");
      // Decode JWT to get chauffeurId
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const chauffeurId = payload && (payload.id || payload.ChauffeurID);
      if (!chauffeurId) throw new Error("Invalid token or chauffeur ID");
      const res = await fetch(
        `http://localhost:5000/api/chauffeurs/assignments/respond/${reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ response: action, chauffeurId }),
        }
      );
      if (!res.ok) throw new Error("Failed to update assignment");
      setActionMsg(`Assignment ${action.toLowerCase()}ed successfully.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-section">
      <h2>Work & Availability</h2>
      <div className="section-content">
        <p>
          <strong>Current Status:</strong> {status}
        </p>
        <Button color="primary" onClick={handleStatusChange} className="mb-3">
          Change Status
        </Button>
        <div className="assigned-vehicles">
          <h4>Assigned Reservations</h4>
          {loading ? (
            <p>Loading assignments...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : assignments.length === 0 ? (
            <p>No pending assignments.</p>
          ) : (
            <ul>
              {assignments.map((a) => (
                <li key={a.ReservationID}>
                  Reservation #{a.ReservationID} for {a.RenterName} ({a.PhoneNumber})
                  <br />
                  <strong>From:</strong> {a.StartDate} <strong>To:</strong> {a.EndDate}
                  <br />
                  <Button
                    color="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleAssignmentAction(a.ReservationID, "Accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleAssignmentAction(a.ReservationID, "Rejected")}
                  >
                    Reject
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {actionMsg && <p className="text-success">{actionMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChauffeurWorkAvailability;
