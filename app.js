const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Sequelize DB setup
const sequelize = require('./src/config/database');

// Load all models
require('./src/models/Accessory');
require('./src/models/Notification');
// Add more models here if needed (e.g., Reservation, User)

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const chauffeurRoutes = require('./src/routes/chauffeurRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const accessoryRoutes = require('./src/routes/accessoryRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes'); // ✅ NEW

// Use routes
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/chauffeurs', chauffeurRoutes);
app.use('/search', searchRoutes);
app.use('/accessories', accessoryRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payments', paymentRoutes); // ✅ NEW

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Vehicle Rental System API');
});

// Start DB and server
sequelize.sync()
  .then(() => {
    console.log('✅ Database synced');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync database:', err);
  });

module.exports = app;
