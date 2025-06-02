const db = require('../db');

async function filteredBicycles(filters) {
  let query = `
    SELECT v.*, b.*
    FROM Vehicle v
    JOIN Bicycle b ON v.VehicleID = b.VehicleID
    WHERE v.status = 'approved'
  `;
  const values = [];

  if (filters.type) {
    query += ` AND b.Type = ?`;
    values.push(filters.type);
  }

  if (filters.gears) {
    query += ` AND b.Gears = ?`;
    values.push(filters.gears);
  }

  if (filters.minPrice) {
    query += ` AND v.price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND v.price <= ?`;
    values.push(filters.maxPrice);
  }

  if (filters.location) {
    query += ` AND v.Location = ?`;
    values.push(filters.location);
  }


  const [results] = await db.query(query, values);
  return results;
}

module.exports = {
  filteredBicycles
};
