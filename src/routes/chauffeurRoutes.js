const express = require("express");
const router = express.Router();
const chauffeurController = require("../controllers/chauffeurController");
const adminAuth = require("../middleware/adminAuth"); 
const authMiddleware = require('../middleware/authMiddleware');
const authChauffeur = require('../middleware/authChauffeur');


router.post("/chauffeurs/register", chauffeurController.registerChauffeur);

router.post("/chauffeurs/login", chauffeurController.loginChauffeur);

router.patch("/chauffeurs/approve/:id",adminAuth, chauffeurController.approveChauffeur);

router.patch("/chauffeurs/reject/:id",adminAuth, chauffeurController.rejectChauffeur);

router.patch("/assignments/respond/:reservationId",authChauffeur, chauffeurController.respondToAssignment);

router.post("/assignments/assign/:reservationId", authMiddleware, chauffeurController.assignChauffeur);

router.get("/chauffeurs/pending", adminAuth, chauffeurController.getPendingChauffeurs);

router.get("/assignments/pending/:chauffeurId", authChauffeur, chauffeurController.getPendingAssignments);

module.exports = router;
