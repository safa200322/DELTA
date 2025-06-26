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

exports.getProfile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const owner = await VehicleOwnerModel.getOwnerById(ownerId);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Don't send password hash
    const { PasswordHash, ...ownerData } = owner;
    res.json(ownerData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { FullName, Email, PhoneNumber, NationalID } = req.body;

    await VehicleOwnerModel.updateOwner(ownerId, { FullName, Email, PhoneNumber, NationalID });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const ownerId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profileImageUrl = `/uploads/profile-pictures/${req.file.filename}`;
    await VehicleOwnerModel.updateProfilePicture(ownerId, profileImageUrl);

    res.json({
      message: 'Profile picture updated successfully',
      profileImageUrl
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const vehicles = await VehicleOwnerModel.getVehiclesByOwner(ownerId);

    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const earnings = await VehicleOwnerModel.getEarningsByOwner(ownerId);
    const recentPayouts = await VehicleOwnerModel.getRecentPayouts(ownerId);

    res.json({
      ...earnings,
      recentPayouts
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};
