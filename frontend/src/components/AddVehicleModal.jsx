import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert
} from "reactstrap";

const carFields = [
  { name: 'Brand', label: 'Brand', required: true },
  { name: 'Model', label: 'Model', required: true },
  { name: 'Year', label: 'Year', type: 'number', required: true },
  { name: 'FuelType', label: 'Fuel Type', required: true },
  { name: 'Seats', label: 'Seats', type: 'number', required: true },
  { name: 'Color', label: 'Color', required: true },
  { name: 'Transmission', label: 'Transmission', required: true },
  { name: 'Location', label: 'Location', required: true },
  { name: 'VehiclePic', label: 'Vehicle Image URL', type: 'url', required: false },
];
const boatFields = [
  { name: 'Brand', label: 'Brand', required: true },
  { name: 'BoatType', label: 'Boat Type', required: true },
  { name: 'Capacity', label: 'Capacity', type: 'number', required: true },
  { name: 'EngineType', label: 'Engine Type', required: true },
  { name: 'Location', label: 'Location', required: true },
  { name: 'VehiclePic', label: 'Vehicle Image URL', type: 'url', required: false },
];
const bicycleFields = [
  { name: 'Type', label: 'Bicycle Type', required: true },
  { name: 'Gears', label: 'Gears', type: 'number', required: true },
  { name: 'Location', label: 'Location', required: true },
  { name: 'VehiclePic', label: 'Vehicle Image URL', type: 'url', required: false },
];
const motorcycleFields = [
  { name: 'Brand', label: 'Brand', required: true },
  { name: 'Engine', label: 'Engine', required: true },
  { name: 'Year', label: 'Year', type: 'number', required: true },
  { name: 'Type', label: 'Motorcycle Type', required: true },
  { name: 'color', label: 'Color', required: true },
  { name: 'Location', label: 'Location', required: true },
  { name: 'VehiclePic', label: 'Vehicle Image URL', type: 'url', required: false },
];

const getFieldsForType = (type) => {
  switch (type) {
    case 'Car': return carFields;
    case 'Boat': return boatFields;
    case 'Bicycle': return bicycleFields;
    case 'Motorcycle': return motorcycleFields;
    default: return [];
  }
};

const getInitialStateForType = (type) => {
  const fields = getFieldsForType(type);
  const state = {};
  fields.forEach(f => state[f.name] = '');
  return state;
};

const AddVehicleModal = ({ isOpen, toggle, onVehicleAdded }) => {
  const [type, setType] = useState('');
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setForm(getInitialStateForType(e.target.value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('vehicleOwnerToken');
      let endpoint = '';
      let body = { ...form };
      switch (type) {
        case 'Car':
          endpoint = 'cars';
          body.vehiclepic = form.VehiclePic;
          break;
        case 'Boat':
          endpoint = 'boats';
          body.vehiclepic = form.VehiclePic;
          break;
        case 'Motorcycle':
          endpoint = 'motorcycles';
          body.vehiclepic = form.VehiclePic;
          break;
        case 'Bicycle':
          endpoint = 'bicycles';
          body.vehiclepic = form.VehiclePic;
          break;
        default:
          throw new Error('Please select a valid vehicle type.');
      }
      // Remove VehiclePic from body if not present
      if (!form.VehiclePic) delete body.VehiclePic;
      const response = await fetch(`http://localhost:5000/api/vehicles/${endpoint}` , {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add vehicle");
      }
      setType('');
      setForm({});
      toggle();
      if (onVehicleAdded) onVehicleAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Add New Vehicle</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="Type">Type</Label>
            <Input type="select" name="Type" id="Type" value={type} onChange={handleTypeChange} required>
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Boat">Boat</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bicycle">Bicycle</option>
            </Input>
          </FormGroup>
          {getFieldsForType(type).map(field => (
            <FormGroup key={field.name}>
              <Label for={field.name}>{field.label}</Label>
              <Input
                type={field.type || 'text'}
                name={field.name}
                id={field.name}
                value={form[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.label}
              />
            </FormGroup>
          ))}
          <ModalFooter>
            <Button color="secondary" onClick={toggle} disabled={loading}>Cancel</Button>
            <Button color="primary" type="submit" disabled={loading || !type}>
              {loading ? <Spinner size="sm" /> : "Add Vehicle"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddVehicleModal;
