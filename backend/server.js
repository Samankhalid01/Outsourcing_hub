require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors'); // Import CORS middleware
const connectDB = require('./config/db'); // MongoDB connection function
const resourceRoutes = require('./routes/resourceRoutes'); // Import resource routes
const jobRoutes = require('./routes/jobs'); // Import job routes
const applicationRoutes = require('./routes/applications'); // Import application routes
const authRoutes = require('./routes/auth'); // Import auth routes

// Initialize the Express app
const app = express();

// Debugging: Log environment initialization
console.log('Starting server...');

// Ensure necessary environment variables are set
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1); // Exit if MongoDB URI is missing
}


app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies if needed
}));


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Middleware for parsing JSON requests
app.use(cors()); // Middleware for handling CORS

// Debugging: Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/resource', resourceRoutes); // Mount resource routes
app.use('/api/jobs', jobRoutes); // Mount job routes
app.use('/api/applications', applicationRoutes); // Mount application routes
app.use('/api/auth', authRoutes); // Mount auth routes for user registration
app.use('/api/auth', require('./routes/auth'));

console.log('Auth routes mounted at /api/auth');

// Health Check/Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware

// Handle 404 errors for undefined routes
app.use((req, res) => {
  console.error('Route not found:', req.url);
  res.status(404).json({ error: 'Route not found' });
});

// Handle internal server errors
app.use((err, req, res, next) => {
  console.error('Internal server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server with dynamic port handling
const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying a different port...`);
      startServer(port + 1); // Retry with the next port
    } else {
      console.error('Server failed to start:', err.message);
    }
  });
};




// Start the server
startServer(PORT);
