const axios = require('axios');
const qs = require('qs');
const Campaign = require('../../../../models/Campaign');
const Agent = require('../../../../models/Agent');
const Package = require("../../../../models/Package");
const Interest = require("../../../../models/Interest");
const { createCampaign } = require('../../createCampain'); // Adjust path as needed

exports.publishInstagramCampaign = async (req, res) => {
  try {
    const {
      packageId,
      name,
      email,
      contact,
      image,
      caption,
      scheduleTime,
      frequency,
      endTime,
      action,
      campaignId,      // Provided campaign ID (custom)
      campaignName,
      campaignType,
      detailsUrl
    } = req.body;

    if (action !== "post-now") {
      return res.status(400).json({ error: "Invalid action" });
    }

    // Ensure that Instagram connection is available (global tokens are set)
    if (!global.LONG_LIVED_TOKEN || !global.IG_USER_ID) {
      return res.status(400).json({ error: "Instagram is not connected. Please connect first." });
    }

    const finalCaption = detailsUrl ? `${caption}\n\nDetails: ${detailsUrl}` : caption;

    // Step 1: Create Media Container on Instagram using finalCaption
    const createUrl = `https://graph.facebook.com/v22.0/${global.IG_USER_ID}/media`;
    const createRes = await axios.post(createUrl, qs.stringify({
      image_url: image,
      caption: finalCaption,
      access_token: global.LONG_LIVED_TOKEN
    }));
    const containerId = createRes.data.id;
    console.log("Created Instagram container with ID:", containerId);


    // const mediaId="1234567890"; // Dummy media ID for testing
    
    // Step 2: Publish the Media Container
    const publishUrl = `https://graph.facebook.com/v22.0/${global.IG_USER_ID}/media_publish`;
    const publishRes = await axios.post(publishUrl, qs.stringify({
      creation_id: containerId,
      access_token: global.LONG_LIVED_TOKEN
    }));
    const mediaId = publishRes.data.id;
    console.log("Published Instagram media with ID:", mediaId);

    // Determine agentId: if not provided, lookup agent by email
    let agentId = req.body.agentId;
    if (!agentId && email) {
      const agentDoc = await Agent.findOne({ "Profile.email": email });
      if (!agentDoc) {
        return res.status(404).json({ error: "Agent not found" });
      }
      agentId = agentDoc._id;
    }

    // Prepare payload for campaign creation using the provided campaign ID.
    // This payload follows your Campaign model.
    const campaignPayload = {
      _id: campaignId,            // Use the campaign ID provided in req.body
      agentId: agentId,
      pkgId: packageId,
      type: campaignType,         // Should be "instagram"
      name: campaignName,
      status: "Running",
      scheduleTime: scheduleTime ? new Date(scheduleTime) : null,
      frequency: frequency,
      endTime: endTime ? new Date(endTime) : null,
      // Extra fields for Instagram campaign:
      caption: finalCaption,
      imageUrl: image,
      detailsUrl: detailsUrl,
      instagramMediaId: mediaId    // Save the published IG media ID
    };

    // Create the campaign using the createCampaign controller
    const campaign = await createCampaign(campaignPayload);
    
        // Convert campaign to a plain object and map _id to id
        const campaignObj = campaign.toObject ? campaign.toObject() : { ...campaign };
        const transformedCampaign = { ...campaignObj, id: campaignObj._id };
        delete transformedCampaign._id;
    
        // ---------- Fetch matching interest contacts for this campaign ----------
        const interests = await Interest.find({ campaignId: campaign._id }).lean();
        const interestContacts = interests.map(interest => ({
          id: interest._id,
          name: interest.name,
          whatsappNumber: interest.whatsappNumber,
          status: interest.status,
          suggestions: interest.suggestions,
          newPkgId: interest.newPkgId
        }));
    
        // Attach interestContacts to the transformed campaign JSON
        transformedCampaign.interestContacts = interestContacts;

    res.status(200).json({
      message: "Instagram campaign created and published successfully",
      campaign: transformedCampaign
    });
  } catch (error) {
    console.error("Error publishing Instagram campaign:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to publish Instagram campaign" });
  }
};
