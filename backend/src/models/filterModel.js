const db = require('../db');

async function getFilteredVehicles(filters) {
  // Log the incoming filters for debugging
  console.log('getFilteredVehicles called with filters:', JSON.stringify(filters, null, 2));

  // Determine the table to join based on type
  let joinTable = 'Car';
  let tableFields = {
    brand: 'Brand',
    model: 'Model',
    seats: 'Seats',
    transmission: 'Transmission',
    color: 'Color',
  };
  if (filters.type === 'motorcycle') {
    joinTable = 'Motorcycle';
    tableFields = {
      brand: 'Brand',
      model: 'Type',
      engine: 'Engine',
      color: 'color',
    };
  } else if (filters.type === 'boat') {
    joinTable = 'Boats';
    tableFields = {
      brand: 'Brand',
      model: 'BoatType',
      capacity: 'Capacity',
      engineType: 'EngineType',
    };
  } else if (filters.type === 'bicycle') {
    joinTable = 'Bicycle';
    tableFields = {
      brand: 'Brand',
      model: 'BikeType',
      frame: 'frame_material',
      wheel: 'wheel_size',
      color: 'color',
    };
  }

  let query = `
    SELECT *
    FROM Vehicle
    JOIN ${joinTable} ON Vehicle.VehicleID = ${joinTable}.VehicleID
    WHERE Vehicle.Status = 'Available'
  `;
  const values = [];

  // If slug is present but vehicleId is not, treat slug as vehicleId
  if (filters.slug && !filters.vehicleId) {
    filters.vehicleId = filters.slug;
  }

  if (filters.vehicleId) {
    query += ` AND Vehicle.VehicleID = ?`;
    values.push(filters.vehicleId);
  }

  // Add dynamic filters for each type
  for (const key in tableFields) {
    if (filters[key]) {
      query += ` AND ${joinTable}.${tableFields[key]} = ?`;
      values.push(filters[key]);
    }
  }

  if (filters.minPrice) {
    query += ` AND Vehicle.Price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND Vehicle.Price <= ?`;
    values.push(filters.maxPrice);
  }

  // Log the final query and values for debugging
  console.log('Executing vehicle filter query:', query);
  console.log('With values:', JSON.stringify(values));

  const [results] = await db.query(query, values);
  return results;
}

module.exports = {
  getFilteredVehicles
};