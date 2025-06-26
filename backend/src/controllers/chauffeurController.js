const bcrypt = require("bcryptjs");
const chauffeurModel = require("../models/chauffeurModel");
const jwt = require('jsonwebtoken');
const path = require('path');

exports.registerChauffeur = async (req, res) => {
  const { Name, PhoneNumber, Email, Password, LicenseNumber, Location, Date_of_birth } = req.body;

  if (!Name || !PhoneNumber || !Email || !Password || !LicenseNumber || !Location|| !Date_of_birth) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingChauffeur = await chauffeurModel.getChauffeurByPhoneNumber(PhoneNumber);
    if (existingChauffeur) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    const result = await chauffeurModel.registerChauffeur({
      Name, PhoneNumber, Email, Password, LicenseNumber, Location, Date_of_birth,
    });

    res.status(201).json({
      message: 'Chauffeur registered successfully',
      chauffeurId: result.insertId
    });

  } catch (err) {
    console.error('Error registering chauffeur:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.loginChauffeur = async (req, res) => {
  const { PhoneNumber, Password } = req.body;

  if (!PhoneNumber || !Password) {
    return res.status(400).json({ message: 'Phone number and password are required' });
  }

  try {
    // Fetch chauffeur by phone number
    const chauffeur = await chauffeurModel.getChauffeurByPhoneNumber(PhoneNumber);
    if (!chauffeur) {
      return res.status(404).json({ message: 'Chauffeur not found' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(Password, chauffeur.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const payload = { ChauffeurID: chauffeur.ChauffeurID, Name: chauffeur.Name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      message: 'Chauffeur logged in successfully',
      token: token
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.assignChauffeur = async (req, res) => {
  const reservationId = req.params.reservationId;

  try {
    const reservation = await chauffeurModel.getReservationById(reservationId);
    if (reservation.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const reservationData = reservation[0];

    const chauffeurs = await chauffeurModel.getAvailableApprovedChauffeursByLocation(reservationData.PickupLocation);
    if (chauffeurs.length === 0) {
      return res.status(404).json({ message: "No available chauffeurs found" });
    }

    const selectedChauffeur = chauffeurs[0]; // or use age-proximity logic

    // 1. Insert into ChauffeurAssignment table
    await chauffeurModel.createChauffeurAssignment(reservationId, selectedChauffeur.ChauffeurID);

    // 2. Mark chauffeur as pending
    await chauffeurModel.setChauffeurAvailability(selectedChauffeur.ChauffeurID, "Pending");

    return res.status(200).json({
      message: "Chauffeur request sent. Awaiting response.",
      chauffeur: {
        id: selectedChauffeur.ChauffeurID,
        name: selectedChauffeur.Name
      }
    });
  } catch (err) {
    console.error("Error assigning chauffeur:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};



exports.getPendingChauffeurs = async (req, res) => {
  try {
    const rows = await chauffeurModel.getPendingChauffeurs();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "No pending chauffeurs found." });
    }
    
    res.json(rows);
  } catch (err) {
    console.error('DB error while fetching pending chauffeurs:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};


exports.approveChauffeur = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid chauffeur ID' });
  
  try {
    const chauffeur = await chauffeurModel.getChauffeurById(id);
    if (!chauffeur) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }
    
    if (chauffeur.Status === 'Approved') {
      return res.status(400).json({ error: 'Chauffeur is already approved' });
    }

    // Update status to Approved
    const result = await chauffeurModel.updateChauffeurStatus(id, 'Approved');
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }

    // NEW: Set availability to Available
    await chauffeurModel.setChauffeurAvailability(id, 'Available');

    res.json({ message: 'Chauffeur approved and availability set to Available.' });
  } catch (err) {
    console.error(`Error while approving chauffeur ID ${id}:`, err.message);
    res.status(500).json({ error: 'Could not approve chauffeur.' });
  }
};


exports.rejectChauffeur = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid chauffeur ID' });
  
  try {
    const chauffeur = await chauffeurModel.getChauffeurById(id);
    if (!chauffeur) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }
    
    if (chauffeur.Status === 'Rejected') {
      return res.status(400).json({ error: 'Chauffeur is already rejected' });
    }

    const result = await chauffeurModel.updateChauffeurStatus(id, 'Rejected');
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }
    
    res.json({ message: 'Chauffeur rejected.' });
  } catch (err) {
    console.error(`Error while rejecting chauffeur ID ${id}:`, err.message);
    res.status(500).json({ error: 'Could not reject chauffeur.' });
  }
};


exports.respondToAssignment = async (req, res) => {
  const reservationId = req.params.reservationId;
  const { response, chauffeurId } = req.body; // chauffeurId must be sent from frontend

  if (!response || !["Accepted", "Rejected"].includes(response)) {
    return res.status(400).json({ message: "Response must be either 'Accepted' or 'Rejected'." });
  }

  try {
    // Get the assignment row
    const assignment = await chauffeurModel.getAssignmentByReservationAndChauffeur(reservationId, chauffeurId);
    if (!assignment || assignment.length === 0) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Check if already responded
    if (assignment[0].Status !== 'Pending') {
      return res.status(400).json({ message: "This assignment has already been responded to." });
    }

    // Update assignment status
    await chauffeurModel.updateAssignmentStatus(reservationId, chauffeurId, response);

    if (response === "Accepted") {
      // Update chauffeur availability
      await chauffeurModel.setChauffeurAvailability(chauffeurId, "Unavailable");

      // Update reservation with chauffeur ID and status
      await chauffeurModel.updateReservationWithChauffeur(reservationId, chauffeurId, "Accepted");

    } else if (response === "Rejected") {
      await chauffeurModel.setChauffeurAvailability(chauffeurId, "Available");
      await chauffeurModel.updateReservationStatusOnly(reservationId, "Rejected");
    }

    return res.status(200).json({ message: `Assignment ${response.toLowerCase()} successfully.` });

  } catch (err) {
    console.error(`Error while responding to reservation ${reservationId}:`, err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};




exports.getPendingAssignments = async (req, res) => {
  const chauffeurId = req.params.chauffeurId;
  try {
    const assignments = await chauffeurModel.getPendingAssignmentsByChauffeur(chauffeurId);
    if (assignments.length === 0) {
      return res.status(404).json({ message: "No pending assignments found" });
    }
    res.json(assignments);
  } catch (err) {
    console.error(`DB error fetching pending assignments for ChauffeurID ${chauffeurId}:`, err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Get a single chauffeur by ID
exports.getChauffeurById = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid chauffeur ID' });
  try {
    const chauffeur = await require('../models/chauffeurModel').getChauffeurById(id);
    if (!chauffeur) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }
    res.json(chauffeur);
  } catch (err) {
    console.error('DB error while fetching chauffeur by ID:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Get the authenticated chauffeur's own profile
exports.getOwnProfile = async (req, res) => {
  try {
    const chauffeur = await require("../models/chauffeurModel").getChauffeurById(req.chauffeur.id);
    if (!chauffeur) {
      return res.status(404).json({ error: "Chauffeur not found" });
    }
    res.json(chauffeur);
  } catch (err) {
    console.error("DB error while fetching chauffeur profile:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Update the authenticated chauffeur's own profile
exports.updateOwnProfile = async (req, res) => {
  try {
    const id = req.chauffeur.id;
    const fields = req.body;
    // Only allow updating certain fields for security
    const allowedFields = ["Name", "PhoneNumber", "Email", "Location", "Date_of_birth", "ProfilePictureUrl"];
    const updates = {};
    for (const key of allowedFields) {
      if (fields[key] !== undefined) updates[key] = fields[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
    const db = require("../models/chauffeurModel");
    const result = await db.updateChauffeurProfile(id, updates);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ error: "Chauffeur not found or not updated" });
    }
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    console.error("Error updating chauffeur profile:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.uploadLicenseFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/licenses/${req.file.filename}`;
  try {
    await chauffeurModel.updateChauffeurLicenseFile(req.user.id, fileUrl);
    res.status(200).json({ message: 'License uploaded successfully', fileUrl });
  } catch (err) {
    console.error('Error saving license file URL:', err);
    res.status(500).json({ message: 'Failed to save license file URL' });
  }
};

exports.getLicenseFileUrl = async (req, res) => {
  try {
    const fileUrl = await chauffeurModel.getChauffeurLicenseFileUrl(req.user.id);
    if (!fileUrl) {
      return res.status(404).json({ message: 'No license file found' });
    }
    res.status(200).json({ fileUrl });
  } catch (err) {
    console.error('Error retrieving license file URL:', err);
    res.status(500).json({ message: 'Failed to retrieve license file URL' });
  }
};
