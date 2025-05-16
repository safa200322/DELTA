const db = require('../db');

exports.searchVehicles = async ({ loc, from, to, type }) => {
 
  let sql = `
    SELECT * FROM Vehicle 
    WHERE Location = ? 
    AND Status = 'Available'
    AND VehicleID NOT IN (
      SELECT VehicleID FROM Reservation
      WHERE (? < EndDate AND ? > StartDate)
    )
  `;

  const values = [loc, from, to];

  if (typeof type !== 'undefined' && type !== null) {
    sql += ` AND Type = ?`;
    values.push(type);
  }

  const [rows] = await db.execute(sql, values);
  return rows;
};
