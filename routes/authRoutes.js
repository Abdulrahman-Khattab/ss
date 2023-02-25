const { login, logout, register } = require('../Controller/authController');
const express = require('express');
const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.get('/logout', logout);

module.exports = Router;
