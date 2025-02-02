// models/Agent.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  HotelRating: { type: String, required: true },
  CityCode: { type: String },
  HotelCode: { type: String, required: true, unique: true },
  feature_embedding: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('hotels', hotelSchema);
