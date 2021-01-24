const express = require('express');

const authRoutes = express.Router();
const authController = require('../controllers/authController');

authRoutes.post('/register', authController.registerUser);
authRoutes.post('/login', authController.login);
authRoutes.post('/forgot_password', authController.forgot_password);
authRoutes.post('/reset_password', authController.reset_password);

module.exports = authRoutes;