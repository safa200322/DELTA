import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Input, Button, Row, Col, Label } from "reactstrap";

const FindCarForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    depart: "",
    return: "",
    vehicleType: "Car",
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

    const formatDateTime = (dateStr) => {
      if (!dateStr) return null;
      return dateStr + " 00:00:00";
    };

    const DataToSend = {
      depart: formatDateTime(formData.depart),
      return: formatDateTime(formData.return),
      vehicleType: formData.vehicleType,
      location: formData.from,
    };

    try {
      const response = await fetch("https://localhost:443/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch vehicle listings: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      let route = "/cars";
      if (formData.vehicleType === "Motorcycle") route = "/motors";
      else if (formData.vehicleType === "Boat") route = "/yachts";

      navigate(route, { state: { vehicles: data.vehicles, formData } });
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  return (
    <Form className="find-car-form" onSubmit={handleSubmit}>
      <Row className="align-items-end">
        <Col lg="3" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="depart">Pick-up Date</Label>
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
            <Label for="return">Return Date</Label>
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
            <Label for="from">Location</Label>
            <Input
              type="text"
              id="from"
              name="from"
              value={formData.from}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="Enter location"
              required
            />
          </FormGroup>
        </Col>
        <Col lg="3" md="6" sm="12" className="mb-3">
          <FormGroup>
            <Label for="vehicleType">Vehicle Type</Label>
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
      </Row>
    </Form>
  );
};

export default FindCarForm;
