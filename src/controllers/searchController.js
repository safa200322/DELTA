const db = require("../db");

exports.searchVehicles = async (req, res) => {
  const loc = req.query.pickupLocation
  const from = req.query.startDate
  const to = req.query.endDate
  const type = req.query.type

  if (!loc || !from || !to) {
    res.status(400).json({ err: 'missing data' })
    return
  }

  let sql = `
    SELECT * FROM Vehicle 
    WHERE Location = ? 
    AND Status = 'Available'
    AND VehicleID NOT IN (
      SELECT VehicleID FROM Reservation
      WHERE (? < EndDate AND ? > StartDate)
    )
  `

  const values = [loc, from, to];
  
  if (type) {
    sql += ` AND Type = ?`;
    values.push(type);
  }


  try {
    const [rows] = await db.execute(sql, values)
    res.json(rows)
  } catch (err) {
    console.log('err get :', err)
    res.status(500).json({ err: 'server issue' })
  }
}
