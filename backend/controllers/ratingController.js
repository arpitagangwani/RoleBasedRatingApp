const db = require('../db');

// Submit or update a rating
const submitRating = (req, res) => {
  const { user_id, store_id, rating } = req.body;

  // Check if the user already rated this store
  const checkQuery = 'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?';
  db.query(checkQuery, [user_id, store_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      // Update rating
      const updateQuery = 'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?';
      db.query(updateQuery, [rating, user_id, store_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.status(200).json({ message: 'Rating updated successfully' });
      });
    } else {
      // Insert new rating
      const insertQuery = 'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)';
      db.query(insertQuery, [user_id, store_id, rating], (err3) => {
        if (err3) return res.status(500).json({ error: err3 });
        res.status(201).json({ message: 'Rating submitted successfully' });
      });
    }
  });
};

// Get ratings for a specific store (for store owner dashboard)
const getStoreRatings = (req, res) => {
  const { store_id } = req.params;

  const query = `
    SELECT u.name, u.email, r.rating 
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.store_id = ?
  `;

  db.query(query, [store_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
};

// ✅ Get all ratings (for user dashboard)
const getAllRatings = (req, res) => {
  const sql = 'SELECT * FROM ratings';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch ratings' });
    res.status(200).json(results);
  });
};


module.exports = {
  submitRating,
  getStoreRatings,
  getAllRatings
};
