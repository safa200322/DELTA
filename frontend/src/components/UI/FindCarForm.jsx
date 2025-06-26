import React, { useState } from "react";
import { Form, FormGroup, Input, Button, Row, Col, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

const FindCarForm = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    depart: "",
    return: "",
    vehicleType: "Car",
    Location: "",
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
    
    // Determine the correct route based on vehicle type
    const routeMap = {
      Car: "/cars",
      Motorcycle: "/motorcycles", 
      Bicycle: "/bicycle",
      Boat: "/boats"
    };
    
    const baseRoute = routeMap[formData.vehicleType] || "/cars";
    
    // Build query string from formData (excluding vehicleType since it's now in the route)
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "vehicleType" && value) {
        if (typeof value === "boolean") {
          params.append(key, value ? "1" : "0");
        } else {
          params.append(key, value);
        }
      }
    });
    
    const url = `${baseRoute}${params.toString() ? `?${params.toString()}` : ""}`;
    console.debug(
      "[FindCarForm] Navigating to:",
      url,
      "with formData:",
      formData
    );
    navigate(url);
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
              <option value="Bicycle">Bicycle</option>
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
    </Form>
  );
};

export default FindCarForm;
