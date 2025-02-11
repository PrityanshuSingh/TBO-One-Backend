// controllers/campaignController.js
const Campaign = require("../../models/Campaign");

exports.createCampaign = async (payload) => {
  // payload should include a custom _id (campaignId), agentId, pkgId, type, name (campaignName),
  // scheduleTime, frequency, endTime, and any extra fields.
  let campaign = await Campaign.findById(payload._id);
  if (!campaign) {
    campaign = new Campaign({
      _id: payload._id, 
      ...payload,      // extra fields will be stored because strict is false
    });
    await campaign.save();
  }
  return campaign;
};
