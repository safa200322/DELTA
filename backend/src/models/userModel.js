const db = require('../db');

exports.findByEmail = async (email) => {
  console.log("Calling db");
  const [rows] = await db.execute('SELECT * FROM User WHERE Email = ?', [email]);
  return rows[0];

};

exports.findByPhone = async (phone) => {
  const [rows] = await db.execute('SELECT * FROM User WHERE PhoneNumber = ?', [phone]);
  return rows[0];
};

exports.findById = async (userId) => {
  const [rows] = await db.execute('SELECT * FROM User WHERE UserID = ?', [userId]);
  return rows[0];
};

exports.createUser = async ({ name, phone, email, hashedPassword, dob, nid, pp }) => {
  return db.execute(
    'INSERT INTO User (Name, PhoneNumber, Email, Password, Date_of_birth, NationalID, PassportNumber) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, phone, email, hashedPassword, dob, nid || null, pp || null]
  );
};
