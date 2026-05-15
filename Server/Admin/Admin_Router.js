const express=require('express');
const router=express.Router();
const adminController=require('./Admin.Controller/Admin_Controller');
const auth = require('../Middleware/auth');

router.get('/getAllUsers', auth.verifyToken, auth.isAdmin, adminController.getAllUsers);
router.get('/getUserById/:id',auth.verifyToken,auth.isAdmin ,adminController.getUserById);
router.get('/getAllProperties', auth.verifyToken, auth.isAdmin, adminController.getAllProperties);
router.get('/getPendingProperties',auth.verifyToken,auth.isAdmin,adminController.getPendingProperties)

router.post('/createSalesAgent',auth.verifyToken, auth.isAdmin, adminController.createSalesAgent);
router.post('/createAdmin', auth.verifyToken, auth.isAdmin, adminController.createAdmin);

router.patch('/property/:id/approve',auth.verifyToken,auth.isAdmin,adminController.approveProperty);

router.delete('/deleteProperty/:id', auth.verifyToken, auth.isAdmin, adminController.deleteProperty);
router.delete('/deleteUser/:id', auth.verifyToken, auth.isAdmin, adminController.deleteUser);

module.exports=router;