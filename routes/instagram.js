const express = require('express');
const router = express.Router();

// In-memory token storage (demo only!). 
// In production, store tokens in DB.
let IG_USER_ID = null; //status callback publish
let SHORT_LIVED_TOKEN = null; //callback
let LONG_LIVED_TOKEN = null; // staus callback publish

/* 
   1. Status Endpoint
   Let your frontend poll or request 
   GET api/auth/status
   => { connected: boolean }
*/
router.get("/status", (req, res) => {
    const isConnected = !!(LONG_LIVED_TOKEN && IG_USER_ID);
    return res.json({ connected: isConnected });
});


/* 
   2. Start Authorization
   GET api/auth/connect
   This is called by the frontend to open in a popup, 
   redirecting user to Instagram (Meta) OAuth flow.
*/
router.get("/connect", (req, res) => {
    console.log("Instagram Connect Request");
    const { FB_APP_ID, IG_REDIRECT_URI } = process.env;

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

    const authUrl =
        `https://www.facebook.com/v22.0/dialog/oauth?` +
        `client_id=${FB_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(IG_REDIRECT_URI)}` +
        `&scope=${scopes.join(",")}` +
        `&response_type=code`;

    // Redirect user to Meta's OAuth dialog
    res.redirect(authUrl);
});

/* 
   3. OAuth Callback 
   GET api/auth/callback
   The user is redirected back here w/ ?code from Instagram. 
   We'll exchange code => short-lived => long-lived tokens,
   find IG user, store them in memory, then close the popup.
*/
router.get("/callback", async (req, res) => {
    try {
        console.log("Instagram Callback Request");
        const { code } = req.query;
        if (!code) {
            return res.status(400).send("No authorization code provided");
        }

        const { FB_APP_ID, FB_APP_SECRET, IG_REDIRECT_URI } = process.env;
        const tokenUrl = "https://graph.facebook.com/v22.0/oauth/access_token";
        const tokenParams = {
            client_id: FB_APP_ID,
            client_secret: FB_APP_SECRET,
            redirect_uri: IG_REDIRECT_URI,
            code,
        };

        // 3a. Exchange code => Short-Lived Token
        const tokenRes = await axios.get(tokenUrl, { params: tokenParams });
        SHORT_LIVED_TOKEN = tokenRes.data.access_token;
        console.log("Short-Lived Token:", SHORT_LIVED_TOKEN);

        // 3b. Exchange short-lived => Long-Lived Token
        const exchangeUrl = "https://graph.facebook.com/v22.0/oauth/access_token";
        const exchangeParams = {
            grant_type: "fb_exchange_token",
            client_id: FB_APP_ID,
            client_secret: FB_APP_SECRET,
            fb_exchange_token: SHORT_LIVED_TOKEN,
        };

        const exchangeRes = await axios.get(exchangeUrl, { params: exchangeParams });
        LONG_LIVED_TOKEN = exchangeRes.data.access_token;
        console.log("Long-Lived Token:", LONG_LIVED_TOKEN);

        // 3c. Retrieve IG User ID
        // Must find a Page connected to this token => get instagram_business_account
        const pagesUrl = "https://graph.facebook.com/v22.0/me/accounts";
        const pagesRes = await axios.get(pagesUrl, {
            params: { access_token: LONG_LIVED_TOKEN },
        });

        const pages = pagesRes.data?.data || [];
        IG_USER_ID = null;
        for (let page of pages) {
            if (page.instagram_business_account) {
                IG_USER_ID = page.instagram_business_account.id;
                console.log("IG_USER_ID:", IG_USER_ID);
                break;
            }
        }

        if (!IG_USER_ID) {
            console.warn("No IG Business Account found. (Token may still be good for user data.)");
        }

        // In a real router, store tokens in DB associated w/ user

        // Return a small snippet that closes the popup
        return res.send(`
      <script>
        window.opener && window.opener.focus();
        window.opener.postMessage("igConnected", "*");
        window.close();
      </script>
    `);
    } catch (err) {
        console.error("Error in Instagram OAuth callback =>", err);
        return res.status(500).send("Instagram OAuth failed");
    }
});

/* 
   4. Publish a Single Image to IG
   POST /instagram/publish
   Body: { imageUrl, caption }
*/
router.post("/publish", async (req, res) => {
    try {
        if (!LONG_LIVED_TOKEN || !IG_USER_ID) {
            return res.status(400).json({ error: "Instagram is not connected. Please connect first!" });
        }

        const { imageUrl, caption } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ error: "Missing 'imageUrl' in request body" });
        }

        // Step A: Create Container
        const createUrl = `https://graph.facebook.com/v22.0/${IG_USER_ID}/media`;
        const createRes = await axios.post(
            createUrl,
            qs.stringify({
                image_url: imageUrl,
                caption: caption || "",
                access_token: LONG_LIVED_TOKEN,
            })
        );
        const containerId = createRes.data.id;
        console.log("Created Container ID:", containerId);

        // Step B: Publish Container
        const publishUrl = `https://graph.facebook.com/v22.0/${IG_USER_ID}/media_publish`;
        const publishRes = await axios.post(
            publishUrl,
            qs.stringify({
                creation_id: containerId,
                access_token: LONG_LIVED_TOKEN,
            })
        );
        const mediaId = publishRes.data.id;
        console.log("Media Published ID:", mediaId);

        return res.json({
            message: "Instagram post published successfully!",
            mediaId,
        });
    } catch (err) {
        console.error("Failed to publish IG post =>", err?.response?.data || err.message);
        return res.status(500).json({ error: "Failed to publish IG post" });
    }
});

module.exports = router