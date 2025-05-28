
const filterModel = require('../models/filterModel');

async function filterVehicles(req, res) {
  try {
    const vehicles = await filterModel.getFilteredVehicles(req.query);
    res.status(200).json(vehicles);
  } catch (err) {
    console.error('error in the filteringg:', err.message);
    res.status(500).json({ error: 'server error' });
  }
}

module.exports = {
  filterVehicles
};


  

  // src/controllers/vehicleController.js
exports.updateVehicle = (req, res) => {
    const { id } = req.params;
    const { Status, Location } = req.body;

    if (!Status || !Location) {
        return res.status(400).json({ message: "Status and Location are required." });
    }

    const query = "UPDATE Vehicle SET Status = ?, Location = ? WHERE VehicleID = ?";
    db.query(query, [Status, Location, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating vehicle", error: err });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({ message: "Vehicle updated successfully" });
    });
};


// src/controllers/vehicleController.js
exports.deleteVehicle = (req, res) => {
    const { id } = req.params;
  
    db.query("DELETE FROM Vehicle WHERE VehicleID = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Error deleting vehicle", error: err });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
  
      res.status(200).json({ message: "Vehicle deleted successfully" });
    });
  };
  
