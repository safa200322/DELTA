const db = require('../db');

async function filteredMotorcycles(filters) {
  let query = `
    SELECT v.*, m.*
    FROM Vehicle v
    JOIN Motorcycle m ON v.VehicleID = m.VehicleID
    WHERE v.Type = 'Motorcycle'
  `;
  const values = [];

  if (filters.brand) {
    query += ` AND m.Brand = ?`;
    values.push(filters.brand);
  }

  if (filters.engine) {
    query += ` AND m.Engine = ?`;
    values.push(filters.engine);
  }

  if (filters.year) {
    query += ` AND m.Year = ?`;
    values.push(filters.year);
  }

  if (filters.color) {
    query += ` AND m.Color = ?`;
    values.push(filters.color);
  }

  if (filters.type) {
    query += ` AND m.Type = ?`;
    values.push(filters.type);
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

  if (filters.status) {
    query += ` AND v.Status = ?`;
    values.push(filters.status);
  }

  const [results] = await db.query(query, values);
  return results;
}

module.exports = {
  filteredMotorcycles
};
