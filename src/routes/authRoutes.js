const express = require('express');
const authRoutes = express.Router();

// every route to /auth

authRoutes.get('/register', async(req, res) => {
  res.send('hello world');
});

module.exports = authRoutes;