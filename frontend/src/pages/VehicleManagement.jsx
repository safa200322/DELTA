import React, { useEffect, useState } from "react";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);

        const OwnerID = localStorage.getItem("OwnerID");
        const response = await fetch(`https://localhost:443/api/vehicles2/carowners?OwnerID=${OwnerID}`);

        if (!response.ok) throw new Error("Failed to fetch vehicles");

        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (vehicleId) => {
    const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:443/api/vehicles2/${vehicleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete vehicle");

      setVehicles((prev) => prev.filter((v) => v.VehicleID !== vehicleId));
    } catch (err) {
      alert(err.message || "Error deleting vehicle");
    }
  };

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!vehicles || vehicles.length === 0) return <p>No vehicles added yet.</p>;

  return (
    <div>
      <h4 className="mb-3">Your Vehicles</h4>
      <div className="d-flex flex-wrap gap-4">
        {vehicles.map((v, index) => (
          <div
            key={index}
            className="card"
            style={{
              width: "18rem",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              fontSize: "1.1rem",
              position: "relative", // needed for absolute positioning of button
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={`https://localhost:443/public/${v.Image}`}
              className="card-img-top mb-2"
              alt={v.Type}
              style={{ height: "150px", objectFit: "cover" }}
            />
            <div className="card-body" style={{ flexGrow: 1 }}>
              <h5 className="card-title">{v.Type}</h5>
              <p className="card-text">
                <strong>ID:</strong> {v.VehicleID}
              </p>
              <p className="card-text">
                <strong>Location:</strong> {v.Location}
              </p>
              <p className="card-text">
                <strong>Price:</strong> ${v.Price}
              </p>
            </div>

            <button
              onClick={() => handleDelete(v.VehicleID)}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "1px solid #d9534f",
                backgroundColor: "#d9534f",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleManagement;
