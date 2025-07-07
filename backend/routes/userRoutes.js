const express = require('express');
const router = express.Router();
const db = require('../db'); // ✅ This was missing
const userController = require('../controllers/userController');

// Register route
router.post('/register', userController.registerUser);

// Login route
router.post('/login', userController.loginUser);

// Update password route
router.put('/update-password', userController.updatePassword);

router.get('/me', (req, res) => {
  const userId = 1; //Replace with a valid user_id from your DB for now

  const sql = `SELECT id, name, email FROM users WHERE id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Not logged in' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
