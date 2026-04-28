const express = require('express');
const router = express.Router();
const loginController = require('../Controllers/login');
const signupController = require('../Controllers/signup');

router.post('/signup', signupController.signup);
router.post('/login', loginController.login);

module.exports = router;