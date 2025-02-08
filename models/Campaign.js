// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  pkgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  grpId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  type: {type : String, enum : ['whatsapp', "email", "instagram"]},
  contactId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  startDate: { type: Date, default : Date.now()},
  endDate: { type: Date },
  interestContacts : { type: mongoose.Schema.Types.Mixed, ref: 'Contact' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
