const Campaign = require('../../models/Campaign');
const Interest = require('../../models/Interest');

exports.getAgentCampaigns = async (req, res) => {
  try {
    const agentId = req.query.agentId;
    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }
    let campaigns = await Campaign.find({ agentId: agentId }).lean();
    for (let i = 0; i < campaigns.length; i++) {
      const camp = campaigns[i];
      const interests = await Interest.find({ campaignId: camp._id }).lean();
      const interestContacts = interests.map(interest => {
        const { _id, ...rest } = interest;
        return { id: _id.toString(), ...rest };
      });
      camp.interestContacts = interestContacts;
      camp.id = camp._id.toString();
      delete camp._id;
    }
    res.status(200).json({ campaigns });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching campaigns', error: err.message });
  }
};
