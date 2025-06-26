const express = require('express');
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors"); // Added CORS
const db = require('./src/db'); // Ensure this is the correct path to your db.js file

dotenv.config();
const app = express();

// Allow CORS from http://localhost:3000
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

app.use(session({
  secret: 'yourSecretHere',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const authRoutes = require("./src/routes/authRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const searchRoutes = require("./src/routes/searchRoutes");
const chauffeurRoutes = require("./src/routes/chauffeurRoutes");
//const paymentRoutes = require("./src/routes/paymentRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");
const filterRoutes = require('./src/routes/filterRoutes');
const boatFilterRoutes = require('./src/routes/boatFilterRoutes');
const bicycleFilterRoutes = require("./src/routes/bicycleFilterRoutes");
const motorcycleFilterRoutes = require('./src/routes/motorcycleFilterRoutes');
const vehicleOwnerRoutes = require('./src/routes/vehicleOwnerRoutes');
const maintenanceRoutes = require('./src/routes/maintenanceRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const reviewRoutes = require("./src/routes/reviewRoutes");

app.use("/api", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/chauffeurs", chauffeurRoutes);
//app.use("/api/payments", paymentRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/accessories", require("./src/routes/accessoryRoutes"));
app.use("/api/admin", require("./src/routes/dashboardRoutes"));
app.use('/api/vehicles', filterRoutes);
app.use('/api/boats', boatFilterRoutes);
app.use('/api/bicycles', bicycleFilterRoutes);
app.use('/api/motorcycles', motorcycleFilterRoutes);
app.use('/api/vehicle-owner', vehicleOwnerRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/reviews", reviewRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Vehicle Rental System API ');
});


const runMigrations = require('./src/db/runMigrations');

(async () => {
  await runMigrations();
  // Start the app after migrations
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
})();
