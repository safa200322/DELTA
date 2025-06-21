const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

router.get("/vehicles", searchController.searchVehicles);
module.exports = router;
