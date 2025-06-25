import React, { useState } from "react";

const AddVehicleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    Type: "",
    Location: "",
    Price: "",
    Chauffeur: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!imageFile) {
        throw new Error("Please upload an image.");
      }

      const data = new FormData();

      // Append each field individually
      data.append("Type", formData.Type);
      data.append("Location", formData.Location);
      data.append("Price", formData.Price);
      data.append("Chauffeur", formData.Chauffeur);

      // Append image file
      data.append("Image", imageFile);

      // Pass FormData up to parent for submission (so parent can add UserID)
      await onSubmit(data);

      setSuccess("Vehicle added successfully!");
      setFormData({
        Type: "",
        Location: "",
        Price: "",
        Chauffeur: "",
      });
      setImageFile(null);
      e.target.reset(); // reset form inputs visually
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f1f1",
        padding: "3rem 1rem",
        overflowY: "auto",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-5 border rounded bg-white shadow-lg"
        style={{
          maxWidth: "700px",
          width: "100%",
          fontSize: "1.25rem",
        }}
      >
        <h3 className="mb-4 text-center fw-bold">Add New Vehicle</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {/* Type dropdown */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Type</label>
          <select
            name="Type"
            className="form-select form-select-lg"
            value={formData.Type}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select...</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Car">Car</option>
            <option value="Bicycle">Bicycle</option>
            <option value="Boat">Boat</option>
          </select>
        </div>

        {/* Location dropdown */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Location</label>
          <select
            name="Location"
            className="form-select form-select-lg"
            value={formData.Location}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select...</option>
            <option value="LEFKOŞA">LEFKOŞA</option>
            <option value="GAZİ MAĞUSA">GAZİ MAĞUSA</option>
            <option value="GİRNE">GİRNE</option>
            <option value="İSKELE">İSKELE</option>
            <option value="GÜZELYURT">GÜZELYURT</option>
            <option value="LEFKE">LEFKE</option>
          </select>
        </div>

        {/* Price input */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Price</label>
          <input
            type="number"
            name="Price"
            className="form-control form-control-lg"
            value={formData.Price}
            onChange={handleChange}
            required
            disabled={loading}
            min="0"
          />
        </div>

        {/* Chauffeur dropdown */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Chauffeur</label>
          <select
            name="Chauffeur"
            className="form-select form-select-lg"
            value={formData.Chauffeur}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Image upload */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Image</label>
          <input
            type="file"
            name="Image"
            className="form-control form-control-lg"
            accept="image/*"
            onChange={handleImageChange}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-success btn-lg w-100 fw-bold"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicleForm;
