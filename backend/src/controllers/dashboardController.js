const db = require('../db');

exports.getAdminDashboard = async (req, res) => {
  try {
    // 1. Total vehicle count by type
    const [vehicleCounts] = await db.query(`
      SELECT Type, COUNT(*) AS count FROM Vehicle GROUP BY Type
    `);

    // 2. Total reservations by status
    const [reservationStats] = await db.query(`
      SELECT Status, COUNT(*) AS count FROM Reservation GROUP BY Status
    `);

    // 3. Recent 5 reservations
    const [recentReservations] = await db.query(`
      SELECT r.ReservationID, u.Name AS UserName, v.Type AS VehicleType, r.StartDate, r.EndDate
      FROM Reservation r
      JOIN User u ON r.UserID = u.UserID
      JOIN Vehicle v ON r.VehicleID = v.VehicleID
      ORDER BY r.StartDate DESC
      LIMIT 5
    `);

    // 4. Total users
    const [userCount] = await db.query(`SELECT COUNT(*) AS totalUsers FROM User`);

    // 5. Reservation growth (last 6 months)
    const [monthlyReservations] = await db.query(`
      SELECT 
        MONTH(StartDate) AS month, 
        COUNT(*) AS count 
      FROM Reservation 
      WHERE StartDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY MONTH(StartDate)
      ORDER BY month
    `);

    // 6. Top vehicle locations
    const [locationStats] = await db.query(`
      SELECT Location, COUNT(*) AS count 
      FROM Vehicle 
      GROUP BY Location 
      ORDER BY count DESC 
      LIMIT 5
    `);

    res.status(200).json({
      vehicleCounts,
      reservationStats,
      recentReservations,
      userCount: userCount[0].totalUsers,
      monthlyReservations,
      locationStats
    });
    console.log('[ADMIN DASHBOARD] vehicleCounts:', vehicleCounts);
    console.log('[ADMIN DASHBOARD] reservationStats:', reservationStats);
    console.log('[ADMIN DASHBOARD] recentReservations:', recentReservations);
    console.log('[ADMIN DASHBOARD] userCount:', userCount[0].totalUsers);
    console.log('[ADMIN DASHBOARD] monthlyReservations:', monthlyReservations);
    console.log('[ADMIN DASHBOARD] locationStats:', locationStats);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard data fetch failed", error: err });
  }
};

// Add: Get vehicle inventory distribution for dashboard
exports.getVehicleInventoryDistribution = async (req, res) => {
  try {
    // Get count of vehicles by type
    const [rows] = await db.query(`
      SELECT Type, COUNT(*) AS count FROM Vehicle GROUP BY Type
    `);
    console.log('[INVENTORY DISTRIBUTION] Raw rows:', rows);
    // Defensive: ensure count is a number
    const total = rows.reduce((sum, row) => sum + Number(row.count), 0);
    const distribution = rows.map(row => ({
      type: row.Type,
      count: Number(row.count),
      percent: total > 0 ? Math.round((Number(row.count) / total) * 1000) / 10 : 0 // 1 decimal
    }));
    res.json({ total, distribution });
    console.log('[INVENTORY DISTRIBUTION] total:', total, 'distribution:', distribution);
  } catch (err) {
    console.error('[INVENTORY DISTRIBUTION] ERROR:', err);
    res.status(500).json({ message: 'Failed to fetch vehicle inventory distribution', error: err });
  }
};
