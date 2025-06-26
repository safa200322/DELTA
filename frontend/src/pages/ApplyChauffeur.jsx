import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import "../styles/apply-chauffeur.css";
import { Link } from "react-router-dom";

const ApplyChauffeur = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    LicenseNumber: "",
    Gender: "",
    PhoneNumber: "",
    Date_of_birth: "",
    Location: "",
    Status: "Pending",
    Password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [countryCode, setCountryCode] = useState("+90"); // Default country code

  // Helper to format phone as (548) 855 04 24
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 8) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, PhoneNumber: formatted });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      PhoneNumber: countryCode + ' ' + formData.PhoneNumber,
    };
    try {
      const response = await fetch("http://localhost:5000/api/chauffeurs/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          Name: "",
          Email: "",
          LicenseNumber: "",
          Gender: "",
          PhoneNumber: "",
          Date_of_birth: "",
          Location: "",
          Status: "Pending",
          Password: "",
        });
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="right-pane">
        <div className="form-box">
          <h2>Apply as Chauffeur</h2>

          {submitted ? (
            <Alert color="success" className="text-center">
              Application submitted! You'll hear from us soon. <br />
              <Link to="/apply-chauffeur" className="text-primary fw-medium text-decoration-none" onClick={() => setSubmitted(false)}>
                Submit another application
              </Link>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="Name">Full Name</Label>
                <Input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="Email">Email</Label>
                <Input type="email" name="Email" value={formData.Email} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="PhoneNumber">Phone Number</Label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    id="countryCode"
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    style={{ width: '90px' }}
                  >
                    <option value="+90">+90</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    {/* Add more country codes as needed */}
                  </select>
                  <Input
                    type="tel"
                    name="PhoneNumber"
                    id="PhoneNumber"
                    placeholder="(548) 855 04 24"
                    value={formData.PhoneNumber}
                    onChange={handlePhoneChange}
                    maxLength={16}
                    style={{ flex: 1 }}
                  />
                </div>
              </FormGroup>

              <FormGroup>
                <Label for="Date_of_birth">Date of Birth</Label>
                <Input type="date" name="Date_of_birth" value={formData.Date_of_birth} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="Gender">Gender</Label>
                <Input type="select" name="Gender" value={formData.Gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="LicenseNumber">Driver's License Number</Label>
                <Input type="text" name="LicenseNumber" value={formData.LicenseNumber} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="Location">Current Location</Label>
                <Input type="text" name="Location" value={formData.Location} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="Password">Password</Label>
                <Input type="password" name="Password" value={formData.Password} onChange={handleChange} required />
              </FormGroup>

              <Button type="submit" color="primary" className="w-100 mt-3">
                Apply for Chauffeur Job
              </Button>
            </Form>
          )}

          <p className="switch-text mt-4 text-center">
            Admin? <Link to="/admin">Go to Admin Panel</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplyChauffeur;
