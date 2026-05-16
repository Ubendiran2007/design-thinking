const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const statsRoutes = require('./routes/statsRoutes');

dotenv.config();

connectDB();

const app = express();

const mongoose = require('mongoose');

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database Status Check Middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1 && req.path !== '/') {
    return res.status(503).json({ 
      message: 'Database not connected. Please check your MongoDB Atlas IP Whitelist settings.' 
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
