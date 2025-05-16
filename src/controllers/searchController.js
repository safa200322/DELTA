const db = require("../db");

const searchModel = require('../models/searchModel');

exports.searchVehicles = async (req, res) => {
  const loc = req.query.pickupLocation
  const from = req.query.startDate
  const to = req.query.endDate
  const type = req.query.type

  if (!loc || !from || !to) {
    res.status(400).json({ err: 'missing data' })
    return
  }


  try {
    const rows = await searchModel.searchVehicles({loc, from, to, type});
    res.json(rows);
  } catch (err) {
    console.log('err get :', err);
    res.status(500).json({ err: 'server issue' });
  }
}
