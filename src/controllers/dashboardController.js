const db = require('../db');

exports.getAdminDashboard = async (req, res) => {
  try {
    // 1. Total vehicle count by type
    const [vehicleCounts] = await db.promise().query(`
      SELECT Type, COUNT(*) AS count FROM Vehicle GROUP BY Type
    `);

    // 2. Total reservations by status
    const [reservationStats] = await db.promise().query(`
      SELECT Status, COUNT(*) AS count FROM Reservation GROUP BY Status
    `);

    // 3. Recent 5 reservations
    const [recentReservations] = await db.promise().query(`
      SELECT r.ReservationID, u.Name AS UserName, v.Type AS VehicleType, r.StartDate, r.EndDate
      FROM Reservation r
      JOIN User u ON r.UserID = u.UserID
      JOIN Vehicle v ON r.VehicleID = v.VehicleID
      ORDER BY r.StartDate DESC
      LIMIT 5
    `);

    // 4. Total users
    const [userCount] = await db.promise().query(`SELECT COUNT(*) AS totalUsers FROM User`);

    // 5. Reservation growth (last 6 months)
    const [monthlyReservations] = await db.promise().query(`
      SELECT 
        MONTH(StartDate) AS month, 
        COUNT(*) AS count 
      FROM Reservation 
      WHERE StartDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY MONTH(StartDate)
      ORDER BY month
    `);

    // 6. Top vehicle locations
    const [locationStats] = await db.promise().query(`
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

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard data fetch failed", error: err });
  }
};
