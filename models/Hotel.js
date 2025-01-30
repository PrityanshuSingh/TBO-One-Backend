// models/Agent.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  cityCode: { type: String, required: true },
  hotelCode: { type: String, required: true, unique: true },
  feature_embedding: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('hotels', hotelSchema);
