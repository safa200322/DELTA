import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from 'reactstrap';

const VehicleOwnerProfileEdit = ({ isOpen, toggle, currentUser, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    PhoneNumber: '',
    NationalID: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        FullName: currentUser.FullName || '',
        Email: currentUser.Email || '',
        PhoneNumber: currentUser.PhoneNumber || '',
        NationalID: currentUser.NationalID || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/vehicle-owner/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        onProfileUpdate(formData);
        setTimeout(() => {
          toggle();
          setSuccess('');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          Edit Profile Information
        </ModalHeader>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          
          <FormGroup>
            <Label for="FullName">Full Name</Label>
            <Input
              type="text"
              id="FullName"
              name="FullName"
              value={formData.FullName}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="Email">Email</Label>
            <Input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="PhoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="PhoneNumber"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="NationalID">National ID</Label>
            <Input
              type="text"
              id="NationalID"
              name="NationalID"
              value={formData.NationalID}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default VehicleOwnerProfileEdit;
