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

exports.createUser = async ({ name, phone, email, hashedPassword, dob, nid, pp, profilePictureUrl }) => {
  return db.execute(
    'INSERT INTO User (Name, PhoneNumber, Email, Password, Date_of_birth, NationalID, PassportNumber, ProfilePictureUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, phone, email, hashedPassword, dob, nid || null, pp || null, profilePictureUrl || null]
  );
};

exports.updateProfilePicture = async (userId, profilePictureUrl) => {
  return db.execute(
    'UPDATE User SET ProfilePictureUrl = ? WHERE UserID = ?',
    [profilePictureUrl, userId]
  );
};

exports.updateUserProfile = async (userId, { name, email, phone }) => {
  return db.execute(
    'UPDATE User SET Name = ?, Email = ?, PhoneNumber = ? WHERE UserID = ?',
    [name, email, phone, userId]
  );
};

exports.updatePassword = async (userId, hashedPassword) => {
  return db.execute(
    'UPDATE User SET Password = ? WHERE UserID = ?',
    [hashedPassword, userId]
  );
};

exports.deleteUser = async (userId) => {
  return db.execute(
    'DELETE FROM User WHERE UserID = ?',
    [userId]
  );
};
