import React, { useState } from "react";

const BoatForm = ({ onSubmit }) => {
  const [length, setLength] = useState("");
  const [capacity, setCapacity] = useState("");
  const [engineType, setEngineType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Length", length);
    formData.append("Capacity", capacity);
    formData.append("EngineType", engineType);

    onSubmit(formData);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        fontSize: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: "20px",
        }}
      >
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Length</label>
          <input
            type="number"
            className="form-control"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Capacity</label>
          <input
            type="number"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Engine Type</label>
          <input
            type="text"
            className="form-control"
            value={engineType}
            onChange={(e) => setEngineType(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          style={{ fontSize: "20px", padding: "12px 20px" }}
        >
          Submit Boat
        </button>
      </form>
    </div>
  );
};

export default BoatForm;
