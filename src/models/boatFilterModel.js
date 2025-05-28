const db = require('../db');

async function filteredBoats(filters) {
  let query = `
    select v.*, b.*
    FROM Vehicle v
    join boats b ON v.VehicleID = b.VehicleID
    where v.status = 'Available'
  `;
  const values = [];

  if (filters.brand) {
    query += ` AND b.Brand = ?`;
    values.push(filters.brand);
  }

  if (filters.boatType) {
    query += ` AND b.BoatType = ?`;
    values.push(filters.boatType);
  }

  if (filters.engineType) {
    query += ` AND b.EngineType = ?`;
    values.push(filters.engineType);
  }

  if (filters.capacity) {
    query += ` AND b.Capacity = ?`;
    values.push(filters.capacity);
  }

  if (filters.minPrice) {
    query += ` AND v.price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND v.price <= ?`;
    values.push(filters.maxPrice);
  }

  const [results] = await db.query(query, values);
  return results;
}

module.exports = {
  filteredBoats
};
