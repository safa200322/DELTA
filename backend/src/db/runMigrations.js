// backend/src/db/runMigrations.js
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

// Update these with your DB config
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
};

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const connection = await mysql.createConnection(dbConfig);
  await connection.query('CREATE TABLE IF NOT EXISTS Migrations (id INT AUTO_INCREMENT PRIMARY KEY, filename VARCHAR(255) NOT NULL UNIQUE, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP)');

  const [rows] = await connection.query('SELECT filename FROM Migrations');
  const applied = new Set(rows.map(r => r.filename));

  for (const file of files) {
    if (!applied.has(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      try {
        await connection.query(sql);
        await connection.query('INSERT INTO Migrations (filename) VALUES (?)', [file]);
        console.log(`Applied migration: ${file}`);
      } catch (err) {
        console.error(`Error applying migration ${file}:`, err);
        await connection.end();
        process.exit(1);
      }
    }
  }
  await connection.end();
  console.log('All migrations applied.');
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
