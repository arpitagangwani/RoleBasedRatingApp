const db = require('../db');

// Add a new store (admin only)
const addStore = (req, res) => {
  const { name, email, address, owner_id } = req.body;

  const query = 'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, address, owner_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Store added successfully', storeId: results.insertId });
  });
};

// Get all stores (for listing/search)
const getAllStores = (req, res) => {
  const query = `
    SELECT s.*, 
    IFNULL(AVG(r.rating), 0) AS average_rating 
    FROM stores s 
    LEFT JOIN ratings r ON s.id = r.store_id 
    GROUP BY s.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
};

module.exports = {
  addStore,
  getAllStores
};
