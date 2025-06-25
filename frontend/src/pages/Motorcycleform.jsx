import React, { useState } from "react";

const Motorcycleform = ({ onSubmit }) => {
  const [brand, setBrand] = useState("");
  const [engineCC, setEngineCC] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("Sport");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Brand", brand);
    formData.append("EngineCC", engineCC);
    formData.append("Year", year);
    formData.append("Type", type);

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
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Brand</label>
          <input
            type="text"
            className="form-control"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Engine CC</label>
          <input
            type="text"
            className="form-control"
            value={engineCC}
            onChange={(e) => setEngineCC(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Year</label>
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Type</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          >
            <option value="Sport">Sport</option>
            <option value="Cruiser">Cruiser</option>
            <option value="Touring">Touring</option>
            <option value="Standard">Standard</option>
            <option value="Scooter">Scooter</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          style={{ fontSize: "20px", padding: "12px 20px" }}
        >
          Submit Motorcycle
        </button>
      </form>
    </div>
  );
};

export default Motorcycleform;
