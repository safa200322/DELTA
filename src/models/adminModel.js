const db = require('../db');

exports.findByPhone = async (phone) => {
  const [rows] = await db.query('SELECT * FROM Admin WHERE PhoneNumber = ?', [phone]);
  return rows[0];
};
