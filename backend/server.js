require('dotenv').config();
console.log("DB_USER:", process.env.DB_USER);  // Debugging
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);  // Debugging
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);

const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const userRoutes = require('./src/routes/userRoutes');  


// Use /api as the route prefix
app.use('/users', userRoutes); // Mounts routes under `/api`
const bookingRoutes = require("./src/routes/bookingRoutes");
app.use("/bookings", bookingRoutes);

const movieRoutes = require("./src/routes/movieRoutes");
app.use('/movies', movieRoutes);

const venueRoutes = require("./src/routes/venueRoutes");
app.use("/venues", venueRoutes);

const showRoutes = require("./src/routes/showRoutes");
app.use("/shows", showRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
