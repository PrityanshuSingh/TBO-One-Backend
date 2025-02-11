// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },

    // Common fields for every campaign type
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    pkgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    type: { type: String, enum: ['whatsapp', 'email', 'instagram'], required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    scheduleTime: { type: Date }, 
    frequency: { type: String, enum: ['1 week', '2 weeks', '1 month', '3 months'] },
    endTime: { type: Date }, // End time for campaign

    // Contact details (common)
    contact: { type: String },
    email: { type: String },
    detailsUrl: { type: String },

    // Extra fields (may be used by one or more campaign types)
    // For WhatsApp campaigns
    title: { type: String },       // WhatsApp: campaign title (e.g. "Rajasthan Royal Heritage Tour")
    description: { type: String }, // WhatsApp: campaign description / message
    message: { type: String },     // WhatsApp: message to send

    // For Instagram campaigns
    caption: { type: String },     // Instagram: caption text

    // For Email campaigns
    subject: { type: String },     // Email: subject line (could be same as package title initially)
    emailBody: { type: String },   // Email: email body content
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }], // Recipients list

    // Additional relational fields (if needed)
    grpId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    contactId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    interestContacts: { type: mongoose.Schema.Types.Mixed, ref: 'Contact' },

    // Timestamps
    startDate: { type: Date, default: Date.now },
  },
  { strict: false, timestamps: true}
);

module.exports = mongoose.model('Campaign', campaignSchema);
