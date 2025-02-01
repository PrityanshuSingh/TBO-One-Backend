const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['whatsApp', 'email'], required: true },
  contactId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }]
});

module.exports = mongoose.model('Group', groupSchema);
