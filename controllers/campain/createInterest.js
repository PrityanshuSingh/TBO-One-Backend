// controllers/interestController.js
const Interest = require("../../models/Interest");
const Campaign = require("../../models/Campaign");

exports.createInterest = async (req, res) => {
  try {
    // Extract campaignId (or campaignid) and other fields from request body
    const { campaignid, campaignId, name, whatsappNumber, suggestions  } = req.body;
    const usedCampaignId = campaignid || campaignId;

    if (!usedCampaignId) {
      return res.status(400).json({ error: "Campaign ID is required." });
    }

    // Find the campaign to obtain the agent's ID
    const campaign = await Campaign.findById(usedCampaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    // Build the interest payload
    const interestPayload = {
      name,
      whatsappNumber,
      suggestions,
      campaignId: usedCampaignId,
      agentId: campaign.agentId,
      newPkgId: null,
      status: "generate",
    };

    // Create and save the new Interest document
    const interest = new Interest(interestPayload);
    await interest.save();

    return res.status(201).json(interest);
  } catch (error) {
    console.error("Error creating interest:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
