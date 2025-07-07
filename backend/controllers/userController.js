const db = require('../db');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = (req, res) => {
  const { name, email, password, address, role } = req.body;

  // 1. Check if all fields are present
  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // 2. Validate name
  if (name.length < 3 || name.length > 60) {
    return res.status(400).json({ error: 'Name must be between 03 and 60 characters' });
  }

  // 3. Validate address
  if (address.length > 400) {
    return res.status(400).json({ error: 'Address must not exceed 400 characters' });
  }

  // 4. Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // 5. Validate password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be 8–16 characters and include at least one uppercase letter and one special character'
    });
  }

  // 6. Check for existing email
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).json({ error: 'Database error' });

    if (checkResults.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // 7. Proceed to register
    const sql = 'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, password, address, role], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Login with JWT token
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input presence
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // 2. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // 3. Find user in DB
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];

    // 4. Check password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      'secret_key', // 🔐 Replace with process.env.JWT_SECRET in production
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};



const updatePassword = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'secret_key');
    const userId = decoded.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    const getUserQuery = 'SELECT password FROM users WHERE id = ?';
    db.query(getUserQuery, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to verify user' });
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });

      const currentPassword = results[0].password;
      if (currentPassword !== oldPassword) {
        return res.status(401).json({ error: 'Old password is incorrect' });
      }

      const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(updateQuery, [newPassword, userId], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: 'Failed to update password' });

        res.status(200).json({ message: 'Password updated successfully' });
      });
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  updatePassword 
};
