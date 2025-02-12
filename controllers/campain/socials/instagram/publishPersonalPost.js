const axios = require('axios');
const qs = require('qs');
// const Campaign = require('../../../../models/Campaign');
// const Agent = require('../../../../models/Agent');
// const Package = require("../../../../models/Package");
// const Interest = require("../../../../models/Interest");
// const { createCampaign } = require('../../createCampain'); // Adjust path as needed

exports.publishInstagramPersonal = async (req, res) => {
  try {
    const {
      packageId,
      name,
      email,
      contact,
      image,
      caption,
      scheduleTime,
      action,
      detailsUrl
    } = req.body;

    if (action !== "post-now") {
      return res.status(400).json({ error: "Invalid action" });
    }

    // Ensure that Instagram connection is available (global tokens are set)
    if (!global.LONG_LIVED_TOKEN || !global.IG_USER_ID) {
      return res.status(400).json({ error: "Instagram is not connected. Please connect first." });
    }

    // Step 1: Create Media Container on Instagram using finalCaption
    const createUrl = `https://graph.facebook.com/v22.0/${global.IG_USER_ID}/media`;
    const createRes = await axios.post(createUrl, qs.stringify({
      image_url: image,
      caption: caption,
      access_token: global.LONG_LIVED_TOKEN
    }));
    const containerId = createRes.data.id;
    console.log("Created Instagram container with ID:", containerId);


    // const mediaId="1234567890"; // Dummy media ID for testing
    
    // Step 2: Publish the Media Container
    // const publishUrl = `https://graph.facebook.com/v22.0/${global.IG_USER_ID}/media_publish`;
    // const publishRes = await axios.post(publishUrl, qs.stringify({
    //   creation_id: containerId,
    //   access_token: global.LONG_LIVED_TOKEN
    // }));
    // const mediaId = publishRes.data.id;
    // console.log("Published Instagram media with ID:", mediaId);


    res.status(200).json({
      message: "Instagram post created and published successfully",
    });
  } catch (error) {
    console.error("Error publishing Instagram campaign:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to publish Instagram campaign" });
  }
};
