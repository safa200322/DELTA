const bcrypt = require("bcryptjs");
const chauffeurModel = require("../models/chauffeurModel");

exports.addChauffeur = async (req, res) => {
  try {
    const { Name, PhoneNumber, Email, Date_of_birth, LicenseNumber, Location, Password } = req.body;
    if (!Name || !PhoneNumber || !Email || !Date_of_birth || !LicenseNumber || !Location || !Password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const hashedPassword = await bcrypt.hash(Password, 10);
    const result = await chauffeurModel.addChauffeur({ 
      Name, 
      PhoneNumber, 
      Email, 
      Date_of_birth, 
      LicenseNumber, 
      Location, 
      Password: hashedPassword 
    });
    return res.status(201).json({ message: "Chauffeur added successfully!", ChauffeurID: result.insertId });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.assignChauffeur = async (req, res) => {
  const reservationId = req.params.reservationId;
  const vehicleId = req.body.vehicleId;

  try {
    // Validate reservation
    const reservationResult = await chauffeurModel.getReservationById(reservationId);
    if (reservationResult.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const reservation = reservationResult[0];

    // Validate user
    const userResult = await chauffeurModel.getUserById(reservation.UserID);
    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult[0];
    const userBirthYear = new Date(user.Date_of_birth).getFullYear();

    // Find chauffeurs
    const chauffeurs = await chauffeurModel.getAvailableApprovedChauffeursByLocation(reservation.PickupLocation);
    if (chauffeurs.length === 0) {
      return res.status(404).json({ message: "No available chauffeurs found" });
    }

    // Sort by age proximity to user
    const sorted = chauffeurs.sort((a, b) => {
      const currentYear = new Date().getFullYear();
      const aAge = currentYear - new Date(a.Date_of_birth).getFullYear();
      const bAge = currentYear - new Date(b.Date_of_birth).getFullYear();
      const userAge = currentYear - userBirthYear;
      return Math.abs(aAge - userAge) - Math.abs(bAge - userAge);
    });

    const selectedChauffeur = sorted[0];

    // ❗ONLY make the chauffeur pending — no reservation or vehicle updates
    await chauffeurModel.setChauffeurAvailability(selectedChauffeur.ChauffeurID, "Pending");

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
    res.json(rows);
  } catch (err) {
    console.error('DB error while fetching pending chauffeurs:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

exports.approveChauffeur = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Missing chauffeur ID' });
  try {
    const result = await chauffeurModel.updateChauffeurStatus(id, 'Approved');
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }
    res.json({ message: 'Chauffeur approved.' });
  } catch (err) {
    console.error('DB error while approving chauffeur:', err);
    res.status(500).json({ error: 'Could not approve chauffeur.' });
  }
};

exports.rejectChauffeur = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Missing chauffeur ID' });
  try {
    const result = await chauffeurModel.updateChauffeurStatus(id, 'Rejected');
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chauffeur not found' });
    }
    res.json({ message: 'Chauffeur rejected.' });
  } catch (err) {
    console.error('DB error while rejecting chauffeur:', err);
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
    // Get reservation to find ChauffeurID
    const [rows] = await chauffeurModel.getReservationById(reservationId);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    const chauffeurId = rows[0].ChauffeurID;

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
    console.error("Error updating response:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


exports.getPendingAssignments = async (req, res) => {
  const chauffeurId = req.params.chauffeurId;
  try {
    const assignments = await chauffeurModel.getPendingAssignmentsByChauffeur(chauffeurId);
    res.json(assignments);
  } catch (err) {
    console.error('DB error fetching pending assignments:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};