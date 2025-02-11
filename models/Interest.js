const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema(
  {
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    newPkgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },

    name: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    status: { type: String, enum: ['send', 'sent', 'generate'], default: 'generate' },
    suggestions: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interest', InterestSchema);
