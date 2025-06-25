const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

console.log(`DB Password: ${process.env.DB_PASSWORD}`); // Debugging line to check if the password is loaded correctly

const db =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


module.exports = db;
