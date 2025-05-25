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
