const boatFilterModel = require('../models/boatFilterModel');

async function filterBoats(req, res) {
  try {
    const boats = await boatFilterModel.filteredBoats(req.query);
    res.status(200).json(boats);
  } catch (err) {
    console.error('boat filter issue:', err.message);
    res.status(500).json({ error: 'server' });
  }
}

module.exports = {
  filterBoats
};
