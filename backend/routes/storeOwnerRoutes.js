const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/storeOwnerController');

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
