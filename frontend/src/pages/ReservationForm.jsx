import React, { useEffect, useState } from "react";

const ReservationForm = ({ reservationId }) => {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        setError(null);

        const stored = localStorage.getItem("VehicleIDs");
        const vehicleIds = stored ? JSON.parse(stored) : [];

        if (!Array.isArray(vehicleIds) || vehicleIds.length === 0) {
          console.warn("⚠️ No VehicleIDs found in localStorage or format invalid.");
        } else {
          console.log("✅ VehicleIDs loaded from localStorage:", vehicleIds);
        }

        const response = await fetch(`https://localhost/api/ownergetreservation/ownerfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vehicleIds }),
        });

        if (!response.ok) throw new Error("Failed to fetch reservation data");

        const data = await response.json();
        setReservationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (loading) return <p>Loading reservation...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!reservationData || reservationData.length === 0) return <p>No reservation found</p>;

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {reservationData.map((reservation) => (
        <div
          key={reservation.ReservationID}
          className="reservation-summary-card"
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "500px",
            backgroundColor: "#f9f9f9",
            flex: "1 1 500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <h3>Reservation Details</h3>

            {reservation.Image ? (
              <img
                src={`https://localhost:443/public/${reservation.Image}`}
                alt="Vehicle"
                style={{ width: "100%", maxHeight: "250px", objectFit: "cover", marginBottom: "15px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x250?text=No+Image+Available";
                }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/400x250?text=No+Image+Available"
                alt="No image"
                style={{ width: "100%", maxHeight: "250px", objectFit: "cover", marginBottom: "15px" }}
              />
            )}

            <p><strong>Pickup Address:</strong> {reservation.PickupLocation || "N/A"}</p>
            <p><strong>Dropoff Address:</strong> {reservation.DropoffLocation || "N/A"}</p>
            <p><strong>Start Date:</strong> {reservation.StartDate ? new Date(reservation.StartDate).toLocaleDateString() : "N/A"}</p>
            <p><strong>End Date:</strong> {reservation.EndDate ? new Date(reservation.EndDate).toLocaleDateString() : "N/A"}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => alert(`Confirmed reservation ${reservation.ReservationID}`)}
            >
              Confirm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationForm;
