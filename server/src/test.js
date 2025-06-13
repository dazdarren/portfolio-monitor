require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');

// Debug logging
console.log('Environment Variables:', {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '****' : undefined,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  JWT_SECRET: process.env.JWT_SECRET ? '****' : undefined
});

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    parent: err.parent ? {
      message: err.parent.message,
      code: err.parent.code
    } : null
  });
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

// Test database connection and start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    if (error.parent) {
      console.error('Database error details:', {
        message: error.parent.message,
        code: error.parent.code,
        detail: error.parent.detail,
        hint: error.parent.hint
      });
    }
  }
}

startServer(); 