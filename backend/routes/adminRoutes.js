const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/dashboard', adminController.getAdminDashboard); 
router.get('/users', adminController.getAllUsers);           
router.get('/stores', adminController.getAllStores);        
router.get('/ratings', adminController.getAllRatings);       

module.exports = router;
