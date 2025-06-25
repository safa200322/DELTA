const bcrypt = require("bcryptjs");
const chauffeurModel = require("../models/chauffeurModel");
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    // Validate reservation
    const reservationResult = await chauffeurModel.getReservationById(reservationId);
    if (reservationResult.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    const reservation = reservationResult[0];

    // Find chauffeurs
    const chauffeurs = await chauffeurModel.getAvailableApprovedChauffeursByLocation(reservation.PickupLocation);
    if (chauffeurs.length === 0) {
      return res.status(404).json({ message: "No available chauffeurs found" });
    }

    // Sort chauffeurs by proximity to the user's age
    const userBirthYear = new Date(reservation.UserDate_of_birth).getFullYear(); // Assuming you have access to the user's DOB
    const sorted = chauffeurs.sort((a, b) => {
      const currentYear = new Date().getFullYear();
      const aAge = currentYear - new Date(a.Date_of_birth).getFullYear();
      const bAge = currentYear - new Date(b.Date_of_birth).getFullYear();
      const userAge = currentYear - userBirthYear;
      return Math.abs(aAge - userAge) - Math.abs(bAge - userAge);
    });

    const selectedChauffeur = sorted[0];

    // Set the chauffeur's status to 'Pending' for this reservation
    await chauffeurModel.setChauffeurAvailability(selectedChauffeur.ChauffeurID, "Pending");

    // Optionally link the chauffeur to the reservation (update ResponseStatus to 'Pending')
    await chauffeurModel.updateReservationResponseStatus(reservationId, "Pending");

    return res.status(200).json({
      message: "Chauffeur request sent. Awaiting chauffeur's response.",
      chauffeur: {
        id: selectedChauffeur.ChauffeurID,
        name: selectedChauffeur.Name
      }
    });
  } catch (err) {
    console.error("Error assigning chauffeur:", err);
    return res.status(500).json({ message: "Internal server error", error: err });
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

    const result = await chauffeurModel.updateChauffeurStatus(id, 'Approved');
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }
    
    res.json({ message: 'Chauffeur approved.' });
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
  const { response } = req.body;

  if (!response || !["Accepted", "Rejected"].includes(response)) {
    return res.status(400).json({ message: "Response must be either 'Accepted' or 'Rejected'." });
  }

  try {
    const [reservation] = await chauffeurModel.getReservationById(reservationId);
    if (reservation.length === 0) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    // Check if reservation is already responded to
    if (reservation[0].ResponseStatus !== 'Pending') {
      return res.status(400).json({ message: 'This assignment has already been responded to.' });
    }

    const chauffeurId = reservation[0].ChauffeurID;

    // Update reservation response status
    await chauffeurModel.respondToAssignment(response, reservationId);

    if (response === "Accepted") {
      await chauffeurModel.setChauffeurAvailability(chauffeurId, "Unavailable");
    } else if (response === "Rejected") {
      await chauffeurModel.setChauffeurAvailability(chauffeurId, "Available");
      await chauffeurModel.releaseChauffeurByReservation(reservationId);
    }

    return res.status(200).json({ message: "Response updated successfully" });
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
