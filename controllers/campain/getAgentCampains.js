// controllers/campaignController.js
const Campaign = require('../models/Campaign');

// Get all campaigns for an agent
exports.getAgentCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ agent: req.params.agentId });
    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching campaigns', error: err });
  }
};
