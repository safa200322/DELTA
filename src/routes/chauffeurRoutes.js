const express = require("express");
const router = express.Router();
const chauffeurController = require("../controllers/chauffeurController");
const adminAuth = require("../middleware/adminAuth"); //  protect route

// Add new chauffeur (admin only)
router.post("/", adminAuth, chauffeurController.addChauffeur);

// Auto-assign chauffeur to a reservation
router.post("/assign/:reservationId", adminAuth, chauffeurController.assignChauffeur);

// Update chauffeur status (approve/reject)
router.put("/chauffeurs/:id/status", adminAuth, chauffeurController.updateChauffeurStatus);
module.exports = router;
