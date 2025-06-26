const db = require('../db');

async function filteredBicycles(filters) {
  let query = `
    SELECT v.*, b.*
    FROM Vehicle v
    JOIN Bicycle b ON v.VehicleID = b.VehicleID
    WHERE v.Status = 'Available'
  `;
  const values = [];

  if (filters.Brand) {
    query += ` AND b.Brand = ?`;
    values.push(filters.Brand);
  }

  if (filters.Type) {
    query += ` AND b.Type = ?`;
    values.push(filters.Type);
  }

  if (filters.Material) {
    query += ` AND b.Material = ?`;
    values.push(filters.Material);
  }

  if (filters.Brakes) {
    query += ` AND b.Brakes = ?`;
    values.push(filters.Brakes);
  }

  if (filters.color) {
    query += ` AND b.color = ?`;
    values.push(filters.color);
  }

  if (filters.minPrice) {
    query += ` AND v.Price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND v.Price <= ?`;
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
