const express = require('express');

const authRoutes = express.Router();
const authController = require('../controllers/authController');

authRoutes.post('/register', authController.registerUser);
authRoutes.post('/login', authController.login);

module.exports = authRoutes;