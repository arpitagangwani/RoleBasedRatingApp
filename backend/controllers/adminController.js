const db = require('../db');

const getAdminDashboard = (req, res) => {
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM stores) AS total_stores,
      (SELECT COUNT(*) FROM ratings) AS total_ratings;
  `;

  db.query(statsQuery, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    res.status(200).json(results[0]);
  });
};

// All Users
const getAllUsers = (req, res) => {
  const sql = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.address,
      u.role,
      CASE 
        WHEN u.role = 'owner' THEN (
          SELECT ROUND(AVG(r.rating), 1)
          FROM stores s
          JOIN ratings r ON r.store_id = s.id
          WHERE s.owner_id = u.id
        )
        ELSE NULL
      END AS average_rating
    FROM users u
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch users' });
    res.status(200).json(results);
  });
};

// All Stores with Avg Rating
const getAllStores = (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.name AS store_name,
      s.address,
      s.email,
      ROUND(AVG(r.rating), 2) AS average_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id, s.name, s.address, s.email
    ORDER BY s.name;
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch stores' });
    res.status(200).json(results);
  });
};

// All Ratings
const getAllRatings = (req, res) => {
  const sql = `
    SELECT 
      r.id,
      r.rating,
      r.created_at,
      u.name AS user_name,
      u.email AS user_email,
      s.name AS store_name
    FROM ratings r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN stores s ON r.store_id = s.id
    ORDER BY r.created_at DESC;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Failed to fetch ratings' });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getAllStores,
  getAllRatings,
};
