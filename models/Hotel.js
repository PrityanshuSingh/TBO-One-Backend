// models/Agent.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  HotelRating: { type: String, required: true },
  CityCode: { type: String },
  HotelCode: { type: String, required: true },
  feature_embedding: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound Unique Index (HotelCode + CityCode)
hotelSchema.index({ HotelCode: 1, CityCode: 1 }, { unique: true });

module.exports = mongoose.model('hotels', hotelSchema);
