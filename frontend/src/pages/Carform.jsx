import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Carform = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [fuelType, setFuelType] = useState("Diesel");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [chauffeur, setChauffeur] = useState("No");
  const [location, setLocation] = useState("LEFKOSA");
  const [carImage, setCarImage] = useState(null);
  const [loading, setLoading] = useState(false); // NEW: loading state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const OwnerID = localStorage.getItem("OwnerID");
    if (!OwnerID) {
      alert("OwnerID not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("Brand", brand);
    formData.append("Model", model);
    formData.append("Year", year);
    formData.append("FuelType", fuelType);
    formData.append("Seats", seats);
    formData.append("Price", price);
    formData.append("Chauffeur", chauffeur);
    formData.append("Location", location);
    formData.append("OwnerID", OwnerID);

    if (carImage) {
      formData.append("Image", carImage);
    }

    try {
      const response = await fetch("https://localhost:443/api/add/addvehicle", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add car");

      setLoading(true); // show loading spinner
      setTimeout(() => {
        alert("Car added successfully!");
        setLoading(false); // hide spinner
      }, 4000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding the car.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        fontSize: "20px",
      }}
    >
      {loading && (
        <div style={{ fontSize: "22px", color: "#007bff", marginBottom: "20px" }}>
          🚗 Adding vehicle... Please wait
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="car-form"
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
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Model</label>
          <input
            type="text"
            className="form-control"
            value={model}
            onChange={(e) => setModel(e.target.value)}
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
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Fuel Type</label>
          <select
            className="form-control"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          >
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Seats</label>
          <input
            type="number"
            className="form-control"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Chauffeur</label>
          <select
            className="form-control"
            value={chauffeur}
            onChange={(e) => setChauffeur(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Location</label>
          <select
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ fontSize: "18px", padding: "10px" }}
          >
            <option value="LEFKOSA">LEFKOSA</option>
            <option value="GUZELYURT">GUZELYURT</option>
            <option value="LEFKE">LEFKE</option>
            <option value="GAZIMAGUSA">GAZIMAGUSA</option>
            <option value="GIRNE">GIRNE</option>
            <option value="ISKELE">ISKELE</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "20px", fontWeight: "600" }}>Car Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setCarImage(e.target.files[0])}
            style={{ fontSize: "18px", padding: "10px" }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          style={{ fontSize: "20px", padding: "12px 20px" }}
          disabled={loading} // disable while loading
        >
          Submit Car
        </button>
      </form>
    </div>
  );
};

export default Carform;
