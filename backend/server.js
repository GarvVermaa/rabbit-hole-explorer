require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const topicRoutes = require('./routes/topics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', topicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rabbit-hole-explorer';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.log('💡 Make sure MongoDB is running: mongod --dbpath /data/db');
    process.exit(1);
  }
};

startServer();
