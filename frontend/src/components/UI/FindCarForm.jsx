import React, { useState } from "react";
import { Form, FormGroup, Input, Button, Row, Col, Label } from "reactstrap";

const FindCarForm = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    depart: "",
    return: "",
    vehicleType: "Car",
    nearbyLocations: false,
    directRoutes: false,
    driverAge25to70: false,
    differentDropoff: false,
    Location: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Build query string from formData
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        params.append(key, value ? "1" : "0");
      } else if (value) {
        params.append(key, value);
      }
    });
    try {
      const response = await fetch(
        `http://localhost:5000/api/vehicles?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        // Optionally handle success (e.g., show results, navigate, etc.)
        console.log("Search submitted successfully");
      } else {
        alert("Search failed.");
      }
    } catch (error) {
      alert("An error occurred.");
    }
  };

  return (
    <Form className="find-car-form" onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col lg="3" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="depart" className="form-label">
              Pick-up Date
            </Label>
            <Input
              type="date"
              id="depart"
              name="depart"
              value={formData.depart}
              onChange={handleChange}
              className="form-control shadow-sm"
            />
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="return" className="form-label">
              Return Date
            </Label>
            <Input
              type="date"
              id="return"
              name="return"
              value={formData.return}
              onChange={handleChange}
              className="form-control shadow-sm"
            />
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="vehicleType" className="form-label">
              Vehicle Type
            </Label>
            <Input
              type="select"
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="form-control shadow-sm"
            >
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Boat">Boat</option>
            </Input>
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="Location" className="form-label">
              Location
            </Label>
            <Input
              type="text"
              id="Location"
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              placeholder="Location (e.g., City Center)"
              className="form-control shadow-sm"
            />
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12" className="mb-3">
          <Button
            type="submit"
            color="primary"
            className="w-100 h-100 modern-btn"
          >
            Search
          </Button>
        </Col>
      </Row>
      <Row>
        <Col lg="3" md="6" sm="12">
          <FormGroup check className="mb-2">
            <Input
              type="checkbox"
              id="nearbyLocations"
              name="nearbyLocations"
              checked={formData.nearbyLocations}
              onChange={handleChange}
              className="form-check-input custom-checkbox"
            />
            <Label for="nearbyLocations" className="form-check-label">
              Add nearby locations
            </Label>
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12">
          <FormGroup check className="mb-2">
            <Input
              type="checkbox"
              id="directRoutes"
              name="directRoutes"
              checked={formData.directRoutes}
              onChange={handleChange}
              className="form-check-input custom-checkbox"
            />
            <Label for="directRoutes" className="form-check-label">
              Direct routes only
            </Label>
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12">
          <FormGroup check className="mb-2">
            <Input
              type="checkbox"
              id="driverAge25to70"
              name="driverAge25to70"
              checked={formData.driverAge25to70}
              onChange={handleChange}
              className="form-check-input custom-checkbox"
            />
            <Label for="driverAge25to70" className="form-check-label">
              Driver age 25 - 70
            </Label>
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12">
          <FormGroup check className="mb-2">
            <Input
              type="checkbox"
              id="differentDropoff"
              name="differentDropoff"
              checked={formData.differentDropoff}
              onChange={handleChange}
              className="form-check-input custom-checkbox"
            />
            <Label for="differentDropoff" className="form-check-label">
              Drop off at a different location
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default FindCarForm;
