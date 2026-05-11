const express = require('express');
const router = express.Router();
const loginController = require('../User.Controller/login');
const signupController = require('../User.Controller/signup');
const CRUD_User = require('../User.Controller/CRUD_User');
const auth = require('../../Middleware/auth');

router.post('/signup', signupController.signup);
router.post('/login', loginController.login);
router.put('/updateUser/:id',auth.verifyToken, CRUD_User.updateUser);
router.delete('/deleteUser/:id',auth.verifyToken, CRUD_User.deleteUser);
module.exports = router;