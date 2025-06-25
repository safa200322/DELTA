const db = require("../db");

const searchModel = require('../models/searchModel');

exports.searchVehicles = async (req, res) => {
  console.log('searching vehicles with query:', req.query);
  const loc = req.query.Location
  const from = req.query.depart
  const to = req.query.return
  const type = req.query.Type

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