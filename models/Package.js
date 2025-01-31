// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    packageTitle: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    shortDescription: { type: String },
    detailedDescription: { type: String },
    price: { type: mongoose.Schema.Types.Mixed, required: true },
    details: { type: mongoose.Schema.Types.Mixed, required: true },
    bestTimeToVisit: { type : String },
    recommendation: { type: [String] },
    notes: { type: String },
    faqs: { type: [mongoose.Schema.Types.Mixed] },
    tagsEmbedding: { type: [Number] },
    type: { type: String, default: "global" }
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model('Package', packageSchema);
