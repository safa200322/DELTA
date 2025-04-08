const express = require('express');
const bodyParser = require("body-parser"); // ✅ Import bodyParser
const session = require("express-session"); 
const vehicleRoutes = require("./src/routes/vehicleRoutes"); // ✅ Import vehicle routes
require('dotenv').config(); // Load environment variables
const searchRoutes = require("./src/routes/searchRoutes");
const app = express();

app.use(express.json()); // Middleware for parsing JSON
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Enable URL-encoded data parsing




app.use("/api", searchRoutes);

//app.use(passport.initialize());
//app.use(passport.session());

// ✅ Import routes
app.use("/api/auth", require("./src/routes/authRoutes")); // ✅ Make sure this is there!
// Load Routes
app.use('/api/vehicles', vehicleRoutes);  // ✅ Mount under /api
app.use("/api/vehicles", require("./src/routes/vehicleRoutes"));

// ✅ Add a root route for "/"
app.get('/', (req, res) => {
    res.send('Welcome to the Vehicle Rental System API 🚀');
});


const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes); // ✅ Mounts /admin-login under /api/auth

app.use("/api/chauffeurs", require("./src/routes/chauffeurRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

exports.loginUser = (req, res) => {
    res.json({ message: "Login route is working!" });
};

//console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
//console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
//console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
