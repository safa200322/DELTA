const db = require('../db');

async function getFilteredVehicles(filters) {
  let query = `
    SELECT *
    FROM Vehicle
    JOIN Car ON Vehicle.VehicleID = Car.VehicleID
    WHERE Vehicle.Status = 'Available'
  `;
  const values = [];

  if (filters.brand) {
    query += ` AND Car.Brand = ?`;
    values.push(filters.brand);
  }

  if (filters.model) {
    query += ` AND Car.Model = ?`;
    values.push(filters.model);
  }

  if (filters.minPrice) {
    query += ` AND Vehicle.Price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND Vehicle.Price <= ?`;
    values.push(filters.maxPrice);
  }

  if (filters.seats) {
    query += ` AND Car.Seats = ?`;
    values.push(filters.seats);
  }

  if (filters.transmission) {
    query += ` AND Car.Transmission = ?`;
    values.push(filters.transmission);
  }

  if (filters.color) {
    query += ` AND Car.Color = ?`;
    values.push(filters.color);
  }

  const [results] = await db.query(query, values);
  return results;
}

module.exports = {
  getFilteredVehicles
};