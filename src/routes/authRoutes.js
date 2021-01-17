const express = require('express');

const authRoutes = express.Router();
const authController = require('../controllers/authController');

// every route to /auth

authRoutes.post('/register', authController.registerUser);

module.exports = authRoutes;