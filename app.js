const express = require('express');
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretHere',       // Change to a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }       // Set to true only if using HTTPS
}));

// Route Imports
const authRoutes = require("./src/routes/authRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const searchRoutes = require("./src/routes/searchRoutes");
const chauffeurRoutes = require("./src/routes/chauffeurRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");

// Routes
app.use("/api", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/chauffeurs", chauffeurRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reservations", reservationRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Vehicle Rental System API ');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
