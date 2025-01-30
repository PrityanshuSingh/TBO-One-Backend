// controllers/campaignController.js
const Campaign = require('../models/Campaign');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, budget, startDate, endDate, agentId, packageId } = req.body;
    const campaign = new Campaign({ title, description, budget, startDate, endDate, agent: agentId, package: packageId });
    await campaign.save();
    res.status(201).json({ message: 'Campaign created successfully', campaign });
  } catch (err) {
    res.status(400).json({ message: 'Error creating campaign', error: err });
  }
};

// Get all campaigns for an agent
exports.getAgentCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ agent: req.params.agentId });
    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching campaigns', error: err });
  }
};
