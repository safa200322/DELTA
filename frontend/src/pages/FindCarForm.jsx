import React, { useState } from "react";
import { Form, FormGroup, Input, Button, Row, Col, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

const FindCarForm = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    depart: "",
    return: "",
    Type: "Car",
    nearbyLocations: false,
    directRoutes: false,
    driverAge25to70: false,
    differentDropoff: false,
    Location: "",
    vehicleType: "Car",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build query string from formData
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      // Only include non-empty and true values
      if (
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "boolean" && value)
      ) {
        params.append(key, value);
      }
    });
    const url = `/cars?${params.toString()}`;
    console.debug("[FindCarForm] Navigating to:", url, "with formData:", formData);
    navigate(url); // Changed from /car-listing to /cars
  };

  return (
    <Form className="find-car-form" onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col lg="4" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="from" className="form-label">
              Pick-up Location
            </Label>
            <Input
              type="text"
              id="from"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="From (e.g., Famagusta)"
              className="form-control shadow-sm"
            />
          </FormGroup>
        </Col>
        <Col lg="4" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="to" className="form-label">
              Drop-off Location
            </Label>
            <Input
              type="text"
              id="to"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="To (e.g., Nicosia)"
              className="form-control shadow-sm"
            />
          </FormGroup>
        </Col>
        <Col lg="2" md="6" sm="12" className="mb-3">
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
        <Col lg="2" md="6" sm="12" className="mb-3">
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
      </Row>
      <Row className="align-items-end">
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
          <Button
            type="submit"
            color="primary"
            className="w-100 h-100 modern-btn"
          >
            Search
          </Button>
        </Col>
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
      </Row>
      <Row>
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
        <Col lg="6" md="6" sm="12"></Col>
      </Row>
      <Row className="align-items-end">
        <Col lg="4" md="6" sm="12" className="mb-3">
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
      </Row>
    </Form>
  );
};

export default FindCarForm;
