const express = require('express');
const axios = require('axios');
const qs = require('qs');
const Agent = require('../models/Agent');
const { publishInstagramCampaign } = require('../controllers/campain/socials/instagram/publishCampaignPost');
const { publishInstagramPersonal } = require('../controllers/campain/socials/instagram/publishPersonalPost');
const router = express.Router();

// Status Endpoint: Check if an agent is connected to Instagram.
router.get("/status", async (req, res) => {
  const agentId = req.query.agentId;
  if (!agentId) return res.status(400).json({ error: "Agent ID is required" });
  try {
    const agent = await Agent.findById(agentId).lean();
    const connected = agent && agent.Profile.instagram && 
      agent.Profile.instagram.longLivedToken && agent.Profile.instagram.igUserId;
    return res.json({ connected: !!connected });
  } catch (err) {
    return res.json({ connected: false });
  }
});

// Start Authorization: Redirects to Instagram OAuth. AgentId must be passed.
router.get("/connect", (req, res) => {
  const { FB_APP_ID, IG_REDIRECT_URI } = process.env;
  const agentId = req.query.agentId;
  if (!agentId) {
    return res.status(400).send("Agent ID required");
  }
  const scopes = [
    "public_profile",
    "email",
    "instagram_basic",
    "instagram_content_publish",
    "read_insights",
    "ads_management",
    "ads_read",
    "business_management",
    "pages_read_engagement"
  ];
  // Append agentId as a query parameter in the redirect URI
  const redirectUri = `${IG_REDIRECT_URI}`;
  const authUrl =
    `https://www.facebook.com/v22.0/dialog/oauth?` +
    `client_id=${FB_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scopes.join(",")}` +
    `&response_type=code`;
  res.redirect(authUrl);
});

// OAuth Callback: Exchange code for tokens, retrieve IG user ID, and update the agent.
router.get("/callback", async (req, res) => {
  try {
    console.log("Instagram Callback Request");
    const { code } = req.query;
    if (!code) {
      return res.status(400).send("Missing authorization code or agentId");
    }
    const { FB_APP_ID, FB_APP_SECRET, IG_REDIRECT_URI } = process.env;
    const tokenUrl = "https://graph.facebook.com/v22.0/oauth/access_token";
    const tokenParams = {
      client_id: FB_APP_ID,
      client_secret: FB_APP_SECRET,
      redirect_uri: `${IG_REDIRECT_URI}`,
      code,
    };
    // Exchange code for short-lived token
    const tokenRes = await axios.get(tokenUrl, { params: tokenParams });
    const shortLivedToken = tokenRes.data.access_token;
    console.log("Short-Lived Token:", shortLivedToken);
    // Exchange short-lived token for long-lived token
    const exchangeUrl = "https://graph.facebook.com/v22.0/oauth/access_token";
    const exchangeParams = {
      grant_type: "fb_exchange_token",
      client_id: FB_APP_ID,
      client_secret: FB_APP_SECRET,
      fb_exchange_token: shortLivedToken,
    };
    const exchangeRes = await axios.get(exchangeUrl, { params: exchangeParams });
    const longLivedToken = exchangeRes.data.access_token;
    console.log("Long-Lived Token:", longLivedToken);
    // Retrieve IG User ID from connected pages
    const pagesUrl = "https://graph.facebook.com/v22.0/me/accounts";
    const pagesRes = await axios.get(pagesUrl, {
      params: { access_token: longLivedToken },
    });
    const pages = pagesRes.data?.data || [];
    let igUserId = null;
    for (let page of pages) {
      if (page.instagram_business_account) {
        igUserId = page.instagram_business_account.id;
        console.log("IG_USER_ID:", igUserId);
        break;
      }
    }
    if (!igUserId) {
      console.warn("No IG Business Account found.");
    }
    // Update the agent in the DB with the tokens and IG user ID.
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).send("Agent not found");
    }
    agent.Profile.instagram.igUserId = igUserId;
    agent.Profile.instagram.longLivedToken = longLivedToken;
    await agent.save();
    // Return script to close the popup.
    return res.send(`
      <script>
        window.opener && window.opener.focus();
        window.opener.postMessage("igConnected", "*");
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("Error in Instagram OAuth callback:", err.response?.data || err.message);
    return res.status(500).send("Instagram OAuth failed");
  }
});

// Publish Instagram Campaign
// This route expects agentId and campaign data in the request body.
router.post("/campaignPost", async (req, res) => {
  try {
    const { agentId } = req.body;
    if (!agentId) {
      return res.status(400).json({ error: "Agent ID is required" });
    }
    // Fetch agent from DB to retrieve IG credentials.
    const agent = await Agent.findById(agentId);
    if (!agent || !agent.Profile.instagram.longLivedToken || !agent.Profile.instagram.igUserId) {
      return res.status(400).json({ error: "Instagram is not connected for this agent" });
    }
    // Set global tokens (if your publishInstagramCampaign uses them)
    global.LONG_LIVED_TOKEN = agent.Profile.instagram.longLivedToken;
    global.IG_USER_ID = agent.Profile.instagram.igUserId;

    // Alternatively, you can pass them directly to the controller.
    // Now call the publishInstagramCampaign controller.
    await publishInstagramCampaign(req, res);

  } catch (err) {
    console.error("Error in publishing Instagram campaign:", err.message);
    res.status(500).json({ error: "Failed to publish Instagram campaign" });
  }
});

router.post("/personalPost", async (req, res) => {
    try {
      const { agentId } = req.body;
      if (!agentId) {
        return res.status(400).json({ error: "Agent ID is required" });
      }
      // Fetch agent from DB to retrieve IG credentials.
      const agent = await Agent.findById(agentId);
      if (!agent || !agent.Profile.instagram.longLivedToken || !agent.Profile.instagram.igUserId) {
        return res.status(400).json({ error: "Instagram is not connected for this agent" });
      }
      // Set global tokens (if your publishInstagramCampaign uses them)
      global.LONG_LIVED_TOKEN = agent.Profile.instagram.longLivedToken;
      global.IG_USER_ID = agent.Profile.instagram.igUserId;
  
      // Alternatively, you can pass them directly to the controller.
      // Now call the publishInstagramCampaign controller.
      await publishInstagramPersonal(req, res);
  
    } catch (err) {
      console.error("Error in publishing Instagram campaign:", err.message);
      res.status(500).json({ error: "Failed to publish Instagram campaign" });
    }
  });

module.exports = router;
