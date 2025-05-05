const express = require("express");
const router = express.Router();
const chauffeurController = require("../controllers/chauffeurController");
const adminAuth = require("../middleware/adminAuth"); //  protect route

// Add new chauffeur (admin only)
router.post("/", adminAuth, chauffeurController.addChauffeur);

// Auto-assign chauffeur to a reservation
router.post("/assign/:reservationId", adminAuth, chauffeurController.assignChauffeur);


//Get pending chauffeurs
router.get('/pending', adminAuth, chauffeurController.getPendingChauffeurs);

//Approve chauffeur
router.put('/:id/approve', adminAuth, chauffeurController.approveChauffeur);

//Reject chauffeur
router.put('/:id/reject', adminAuth, chauffeurController.rejectChauffeur);
module.exports = router;
