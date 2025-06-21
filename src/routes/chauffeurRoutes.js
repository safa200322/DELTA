const express = require("express");
const router = express.Router();
const chauffeurController = require("../controllers/chauffeurController");
const adminAuth = require("../middleware/adminAuth"); //  protect route

router.post("/chauffeurs", chauffeurController.addChauffeur);

router.patch("/chauffeurs/approve/:id",adminAuth, chauffeurController.approveChauffeur);
router.patch("/chauffeurs/reject/:id",adminAuth, chauffeurController.rejectChauffeur);

router.patch("/assignments/respond/:reservationId", chauffeurController.respondToAssignment);

router.post("/assignments/assign/:reservationId", chauffeurController.assignChauffeur);

router.get("/chauffeurs/pending", chauffeurController.getPendingChauffeurs);
router.get('/:chauffeurId/pending-assignments', chauffeurController.getPendingAssignments);
router.get("/assignments/pending/:chauffeurId", chauffeurController.getPendingAssignments);

module.exports = router;