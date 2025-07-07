const db = require('../db');
const jwt = require('jsonwebtoken');

const getOwnerDashboard = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'secret_key');
    const ownerId = decoded.user?.id || decoded.id;
    console.log("✅ Token verified. Owner ID:", ownerId);

    const storeQuery = 'SELECT id FROM stores WHERE owner_id = ?';
    db.query(storeQuery, [ownerId], (err, storeResults) => {
      if (err) {
        console.error("❌ DB Error while fetching store:", err);
        return res.status(500).json({ error: 'Failed to fetch store' });
      }

      if (storeResults.length === 0) {
        console.log("ℹ️ No store found for owner");
        return res.status(200).json({ ratings: [], average_rating: 0 });
      }

      const storeId = storeResults[0].id;
      console.log("✅ Store found. Store ID:", storeId);

    const ratingQuery = `
    SELECT r.rating, r.created_at, u.name AS user_name, u.email AS user_email
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.store_id = ?
    `;


      db.query(ratingQuery, [storeId], (ratingErr, ratingResults) => {
        if (ratingErr) {
          console.error("❌ Error fetching ratings:", ratingErr);
          return res.status(500).json({ error: 'Failed to fetch ratings' });
        }

        const avgQuery = `SELECT ROUND(AVG(rating), 2) AS avg_rating FROM ratings WHERE store_id = ?`;
        db.query(avgQuery, [storeId], (avgErr, avgResults) => {
          if (avgErr) {
            console.error("❌ Error fetching average rating:", avgErr);
            return res.status(500).json({ error: 'Failed to fetch average rating' });
          }

          console.log("✅ Ratings and average fetched");
          return res.status(200).json({
            ratings: ratingResults,
            average_rating: avgResults[0].avg_rating || 0
          });
        });
      });
    });

  } catch (err) {
    console.error("❌ Invalid token:", err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { getOwnerDashboard };
