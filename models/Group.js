// models/Campaign.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date, default : null },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  contact : {type : [mongoose.Schema.Types.ObjectId] , ref : 'Contact', required : true},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', groupSchema);
