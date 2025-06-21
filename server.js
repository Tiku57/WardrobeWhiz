require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const itemRoutes = require('./routes/items'); // Our item API routes
const db = require('./db'); // Ensure database connection and table creation runs

const app = express();
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/items', itemRoutes);

// Basic route for home page (optional)
app.get('/', (req, res) => {
    res.send('E-commerce Backend API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});