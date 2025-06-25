import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";

const ApplyChauffeur = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    license: "",
    location: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
        Name: formData.fullname,
        PhoneNumber: formData.phoneNumber,
        Email: formData.email,
        Date_of_birth: formData.dateOfBirth,
        LicenseNumber: formData.license,
        Location: formData.location,
        Password: formData.password
};


    try {
      const response = await fetch("https://localhost:443/api/chauffeurs/chauffeurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Application failed: ${result.message || "Unknown error"}`);
        return;
      }

      alert("Application submitted successfully!");
    
    } catch (error) {
      console.error("Chauffeur application error:", error);
      alert("An error occurred while submitting your application.");
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Container fluid>
        <Row className="min-vh-100">
          <Col lg="6" className="d-none d-lg-block p-0">
            <img
              src="https://placehold.co/800x1200/667fff/ffffff.png?text=Join+Us"
              alt="Join Background"
              className="img-fluid w-100 h-100 object-fit-cover"
            />
          </Col>
          <Col
            lg="6"
            className="d-flex align-items-center justify-content-center"
          >
            <div className="p-4 p-md-5 w-100" style={{ maxWidth: "450px" }}>
              <h1 className="text-center mb-4 text-primary fw-bold display-5">
                Apply as Chauffeur
              </h1>

              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <Label for="fullname" className="fw-medium">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-control-lg rounded-3"
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="email" className="fw-medium">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="form-control-lg rounded-3"
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="password" className="fw-medium">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="form-control-lg rounded-3"
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="phoneNumber" className="fw-medium">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="form-control-lg rounded-3"
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="dateOfBirth" className="fw-medium">
                    Date of Birth
                  </Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="form-control-lg rounded-3"
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="gender" className="fw-medium">
                    Gender
                  </Label>
                  <Input
                    type="select"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-control-lg rounded-3"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Input>
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="license" className="fw-medium">
                    Driver's License Number
                  </Label>
                  <Input
                    type="text"
                    id="license"
                    value={formData.license}
                    onChange={handleChange}
                    placeholder="Enter your license number"
                    className="form-control-lg rounded-3"
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-4">
                  <Label for="location" className="fw-medium">
                    Current Location
                  </Label>
                  <Input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your current location"
                    className="form-control-lg rounded-3"
                    required
                  />
                </FormGroup>

                <div className="d-grid">
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="rounded-3"
                  >
                    Apply for Chauffeur Job
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Chauffeur{" "}
                  <Link
                    to="/chauffeurLogin"
                    className="text-primary text-decoration-none fw-medium"
                  >
                    Chauffeur Login
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ApplyChauffeur;
