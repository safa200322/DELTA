const bicycleFilterModel = require('../models/bicycleFilterModel');

async function filterBicycles(req, res) {
  try {
    const bicycles = await bicycleFilterModel.filteredBicycles(req.query);
    res.status(200).json(bicycles);
  } catch (err) {
    console.error('bicycle filter issue:', err.message);
    res.status(500).json({ error: 'server error' });
  }
}

module.exports = {
  filterBicycles
};
