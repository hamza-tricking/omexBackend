const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

// Proxy all auth requests to the main auth routes
router.use('/', authRoutes);

module.exports = router;
