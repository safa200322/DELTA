import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import "../styles/apply-chauffeur.css";
import { DataContext } from "./DataContext";
import { Link } from "react-router-dom";

const ApplyChauffeur = () => {
  const { addChauffeur } = useContext(DataContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    license: "",
    gender: "",
    phoneNumber: "",
    dateOfBirth: "",
    location: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addChauffeur({
      id: Date.now(),
      ...formData,
      status: "Pending",
    });
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      license: "",
      gender: "",
      phoneNumber: "",
      dateOfBirth: "",
      location: "",
    });
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
                <Label for="name">Full Name</Label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="phoneNumber">Phone Number</Label>
                <Input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="dateOfBirth">Date of Birth</Label>
                <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="gender">Gender</Label>
                <Input type="select" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="license">Driver's License Number</Label>
                <Input type="text" name="license" value={formData.license} onChange={handleChange} required />
              </FormGroup>

              <FormGroup>
                <Label for="location">Current Location</Label>
                <Input type="text" name="location" value={formData.location} onChange={handleChange} required />
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
