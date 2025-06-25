const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Force dotenv to use the .env in the project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('Database connection details:');
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const db =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


module.exports = db;
