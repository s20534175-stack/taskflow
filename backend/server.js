const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'TaskFlow API running', version: '1.0.0' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Keep Render backend alive
setInterval(() => {
  https.get('https://taskflow-backend-rnas.onrender.com', (res) => {
    console.log('Self-ping status:', res.statusCode);
  }).on('error', (err) => {
    console.error('Self-ping error:', err.message);
  });
}, 14 * 60 * 1000);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });