const db = require("../db");

exports.searchVehicles = (req, res) => {
  const { pickupLocation, startDate, endDate } = req.query;

  const query = `
    SELECT * FROM Vehicle 
    WHERE Location = ? 
    AND Status = 'Available'
    AND VehicleID NOT IN (
      SELECT VehicleID FROM Reservation
      WHERE (? < EndDate AND ? > StartDate)
    )
  `;

  db.query(query, [pickupLocation, startDate, endDate], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};
