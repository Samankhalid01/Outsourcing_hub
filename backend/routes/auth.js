const express = require('express');
const { registerUser, loginUser } = require('../controllers/authControllers');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware for logging all requests (only enable in development)
if (process.env.NODE_ENV === 'development') {
  router.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
  });
}

// Middleware to validate JWT token
const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user payload to request object
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// POST /register - Register a new user
router.post('/register', registerUser);

// POST /login - Log in a user and return a JWT token
router.post('/login', loginUser);

// GET /validate-token - Validate JWT and return user details
router.get('/validate-token', validateToken, (req, res) => {
  res.status(200).json({ user: req.user }); // Return decoded user payload
});

// Catch-all for unmatched routes in auth.js
router.all('*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

module.exports = router;
