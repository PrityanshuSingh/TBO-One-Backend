const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  name: { type: String, required: true },
  whatsApp: { type: String, required: true },
  email: { type: String },
  travelHistory: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Customer', customerSchema);
