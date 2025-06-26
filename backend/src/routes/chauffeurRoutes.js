const express = require("express");
const router = express.Router();
const chauffeurController = require("../controllers/chauffeurController");
const adminAuth = require("../middleware/adminAuth");
const authMiddleware = require('../middleware/authMiddleware');
const authChauffeur = require('../middleware/authChauffeur');
const uploadLicense = require('../config/multerLicenseConfig');


router.post("/register", chauffeurController.registerChauffeur);

// router.post("/login", chauffeurController.loginChauffeur); // Removed, use unified login

router.patch("/approve/:id", adminAuth, chauffeurController.approveChauffeur);

router.patch("/reject/:id", adminAuth, chauffeurController.rejectChauffeur);

router.patch("/assignments/respond/:reservationId", authChauffeur, chauffeurController.respondToAssignment);

router.post("/assignments/assign/:reservationId", authMiddleware, chauffeurController.assignChauffeur);

router.get("/pending", adminAuth, chauffeurController.getPendingChauffeurs);

router.get("/assignments/pending/:chauffeurId", authChauffeur, chauffeurController.getPendingAssignments);

// Get the authenticated chauffeur's own profile
router.get("/me", authChauffeur, chauffeurController.getOwnProfile);

// Update chauffeur profile (self-service)
router.put("/me", authChauffeur, chauffeurController.updateOwnProfile);

// Upload chauffeur license file
router.post("/me/license", authChauffeur, uploadLicense.single('license'), chauffeurController.uploadLicenseFile);
// Get chauffeur license file URL
router.get("/me/license", authChauffeur, chauffeurController.getLicenseFileUrl);

// Change password for authenticated chauffeur
router.put("/me/password", authChauffeur, chauffeurController.changePassword);

// Get a single chauffeur by ID
router.get("/:id", adminAuth, chauffeurController.getChauffeurById);

// Get booking history for the authenticated chauffeur
router.get("/bookings/history", authChauffeur, chauffeurController.getBookingHistory);

module.exports = router;