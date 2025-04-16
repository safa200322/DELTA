const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import DB and models
const sequelize = require('./src/config/database');
require('./src/models/Accessory'); // Accessory model

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const chauffeurRoutes = require('./src/routes/chauffeurRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const accessoryRoutes = require('./src/routes/accessoryRoutes'); // ✅ New route

// Use routes
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/chauffeurs', chauffeurRoutes);
app.use('/search', searchRoutes);
app.use('/payments', paymentRoutes);
app.use('/accessories', accessoryRoutes); // ✅ New route

// Static Files (if you have frontend/public)
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Vehicle Rental System API');
});

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

module.exports = app;
