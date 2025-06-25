import React, { useState } from "react";

const BicycleForm = ({ onSubmit }) => {
  const [type, setType] = useState("Road");
  const [gears, setGears] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Type", type);
    formData.append("Gears", gears);

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
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Type</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          >
            <option value="Road">Road</option>
            <option value="Mountain">Mountain</option>
            <option value="Hybrid">Hybrid</option>
            <option value="BMX">BMX</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Gears</label>
          <input
            type="number"
            className="form-control"
            value={gears}
            onChange={(e) => setGears(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          style={{ fontSize: "20px", padding: "12px 20px" }}
        >
          Submit Bicycle
        </button>
      </form>
    </div>
  );
};

export default BicycleForm;
