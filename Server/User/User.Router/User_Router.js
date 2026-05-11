const express = require('express');
const router = express.Router();
const loginController = require('../User.Controller/login');
const signupController = require('../User.Controller/signup');
const CRUD_User = require('../User.Controller/CRUD_User');
const verifyToken = require('../../Middleware/auth');

router.post('/signup', signupController.signup);
router.post('/login', loginController.login);
router.get('/getAllUsers',verifyToken, CRUD_User.getAllUsers);
router.get('/getUserById/:id',verifyToken, CRUD_User.getUserById);
router.put('/updateUser/:id',verifyToken, CRUD_User.updateUser);
router.delete('/deleteUser/:id',verifyToken, CRUD_User.deleteUser);
module.exports = router;