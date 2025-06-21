const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VehicleOwnerModel = require('../models/vehicleOwnerModel');

exports.register = async (req, res) => {
  try {
    const { FullName, Email, Password, PhoneNumber, NationalID } = req.body;

    if (!FullName || !Email || !Password || !PhoneNumber || !NationalID) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingOwner = await VehicleOwnerModel.getOwnerByEmail(Email);
    if (existingOwner) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const PasswordHash = await bcrypt.hash(Password, 10);
    const result = await VehicleOwnerModel.createOwner({ FullName, Email, PasswordHash, PhoneNumber, NationalID });

    res.status(201).json({ message: 'Vehicle owner registered successfully.', OwnerID: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const owner = await VehicleOwnerModel.getOwnerByEmail(Email);
    if (!owner) return res.status(404).json({ message: 'Owner not found.' });

    const isMatch = await bcrypt.compare(Password, owner.PasswordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: owner.OwnerID, role: 'vehicle_owner' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};
