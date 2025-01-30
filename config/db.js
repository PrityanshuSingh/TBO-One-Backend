// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
  }
};

module.exports = connectDB;
