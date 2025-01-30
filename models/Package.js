// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, required: true },
    analytics: { type: mongoose.Schema.Types.Mixed, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    destination: { type: String, required: true },
    tagList: { type: [String], required: true },
    tagsEmbedding: { type: [Number], required: true }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model('Package', packageSchema); s
