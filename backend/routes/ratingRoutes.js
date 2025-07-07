const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// ✅ Submit or update a rating
router.post('/', ratingController.submitRating);

// ✅ Get all ratings (for UserDashboard.js)
router.get('/', ratingController.getAllRatings);

// ✅ Get ratings for a specific store (for owner dashboard)
router.get('/:store_id', ratingController.getStoreRatings);

module.exports = router;
