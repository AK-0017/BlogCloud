const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database.js'); // This will execute the database initialization script

const JWT_SECRET = 'your_very_secret_key_should_be_long_and_random';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Basic route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    const findUserSql = `SELECT email FROM users WHERE email = ?`;
    db.get(findUserSql, [email], async (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ message: 'Server error while checking user.' });
      }
      if (row) {
        return res.status(400).json({ message: 'Email already registered.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user into database
      const insertUserSql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
      db.run(insertUserSql, [name, email, hashedPassword], function(err) {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ message: 'Error registering new user.' });
        }
        res.status(201).json({ message: 'User registered successfully.', userId: this.lastID });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login route
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const findUserSql = `SELECT * FROM users WHERE email = ?`;
    db.get(findUserSql, [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ message: 'Server error while finding user.' });
      }
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials. User not found.' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials. Password incorrect.' });
      }

      // User matched, create JWT
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };

      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1h' }, // Token expires in 1 hour
        (err, token) => {
          if (err) {
            console.error('JWT signing error:', err);
            return res.status(500).json({ message: 'Error generating token.'});
          }
          res.json({ 
            message: 'Login successful.',
            token,
            user: { id: user.id, email: user.email, name: user.name }
          });
        }
      );
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Generic error handler middleware (should be the last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
