// models/Package.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    segment: { type: String, required: true },
    social: { type: String, required: true },
    name: { type: String, required: true },
    html: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: false
  }
);

module.exports = mongoose.model('Template', templateSchema);
