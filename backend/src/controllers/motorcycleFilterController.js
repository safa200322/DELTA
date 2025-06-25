const motorcycleFilterModel = require('../models/motorcycleFilterModel');

async function filterMotorcycles(req, res) {
  try {
    const motorcycles = await motorcycleFilterModel.filteredMotorcycles(req.query);
    res.status(200).json(motorcycles);
  } catch (err) {
    console.error('Motorcycle filter error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  filterMotorcycles
};
