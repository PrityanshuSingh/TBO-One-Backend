const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  Profile: {
    role: { type: String, enum: ['ADMIN', 'AGENT'], default: 'AGENT' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    region: { type: String, required: true },
    contactNumber: { type: String, required: true },
    website: { type: String, required: true },
    specialization: { type: [String], default: [] },
    experienceYears: { type: Number, required: true },
    profileImage: { type: String, required: true },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
    personalized: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }]
  },
  userName: { type: String, required: true, unique : true},
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Agent', agentSchema);
