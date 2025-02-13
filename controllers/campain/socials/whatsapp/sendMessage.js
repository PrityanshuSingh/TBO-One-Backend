// controllers/campaignController.js
const sendWhatsappMessage = require("../../../../utils/socials/whatsapp/twilio/sendWhatsappMessage");
const Contact = require("../../../../models/Customer");
const Group = require("../../../../models/Group");
const Package = require("../../../../models/Package");
const Agent = require("../../../../models/Agent");
const Interest = require("../../../../models/Interest"); // Import the Interest model
const { createCampaign } = require("../../createCampain");

exports.sendMessage = async (req, res, next) => {
  try {
    // Parse groupIds and contactIds from req.body (assumed as JSON strings)
    let groupIdsArray = [];
    let contactIdsArray = [];
    try {
      groupIdsArray = JSON.parse(req.body.groupIds || "[]");
      contactIdsArray = JSON.parse(req.body.contactIds || "[]");
    } catch (error) {
      console.error("Invalid JSON:", error);
      return res.status(400).json({ error: "Invalid format in request" });
    }

    // Format the incoming message
    let formattedMessage = req.body.message || "";
    formattedMessage = formattedMessage.replace(/\r\n/g, "\n\n");
    formattedMessage = formattedMessage.replace(
      /^Details:\s*(.*)$/m,
      `View Details: ${req.body.detailsUrl}\n`
    );

    // ---------- Fetch Contact Numbers for Individual Contact IDs ----------
    let contactNumbers = [];
    if (contactIdsArray.length > 0) {
      const contacts = await Contact.find({ _id: { $in: contactIdsArray } });
      contactNumbers = contacts.map(contact => contact.whatsApp);
    }

    // ---------- Fetch Groups, Extract Contact IDs, and Get Their Phone Numbers ----------
    let groupContactNumbers = [];
    if (groupIdsArray.length > 0) {
      const groups = await Group.find({ _id: { $in: groupIdsArray } });
      const groupContactIds = groups.reduce((acc, group) => {
        if (group.contactId && Array.isArray(group.contactId)) {
          return acc.concat(group.contactId);
        }
        return acc;
      }, []);
      const uniqueGroupContactIds = [
        ...new Set(groupContactIds.map(id => id.toString()))
      ];
      if (uniqueGroupContactIds.length > 0) {
        const groupContacts = await Contact.find({ _id: { $in: uniqueGroupContactIds } });
        groupContactNumbers = groupContacts.map(contact => contact.whatsApp);
      }
    }
    const allPhoneNumbers = [...contactNumbers, ...groupContactNumbers];
    const uniquePhoneNumbers = [...new Set(allPhoneNumbers)];
    console.log("Unique Phone Numbers:", uniquePhoneNumbers);

    // ---------- Fetch Package Details ----------
    const fetchPackage = await Package.findOne({ _id: req.body.packageId });
    const mediaUrl = fetchPackage?.image || null;

    // ---------- Fetch Agent by Email ----------
    // Assume the agent's email is provided in req.body.email
    const agent = await Agent.findOne({ "Profile.email": req.body.email });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }
    console.log("Agent found with _id:", agent._id);

    // ---------- Campaign Creation / Retrieval ----------
    const {
      campaignId,      // Provided by client as a 24-character hex string
      campaignName,    
      campaignType,   
      title,    
      description,    
      scheduleDateTime,
      frequency,
      campaignEnd,     // End time (for campaignEnd)
    } = req.body;

    // Prepare payload for campaign creation
    const campaignPayload = {
      _id: campaignId,         // Our custom campaign ID
      agentId: agent._id,       // Retrieved from agent lookup
      pkgId: req.body.packageId,
      type: campaignType,
      name: campaignName,       // Common field (campaign name)
      status: "Running",        // Default status
      scheduleTime: scheduleDateTime ? new Date(scheduleDateTime) : null,
      frequency: frequency,
      endTime: campaignEnd ? new Date(campaignEnd) : null,
      // Extra fields for WhatsApp campaign (or others):
      title: title,
      description: description,
      message: req.body.message,
      detailsUrl: req.body.detailsUrl,
      imageUrl: mediaUrl,
      grpId: groupIdsArray,
      contactId: contactIdsArray,
    };

    // Create or update campaign document using the campaign controller
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

    // ---------- (Optional) Loop through each phone number and send the WhatsApp message ----------
    for (const number of uniquePhoneNumbers) {
      await sendWhatsappMessage(number, formattedMessage, mediaUrl);
    }

    res.status(201).json({ message: "Message sent successfully", campaign: transformedCampaign });
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.sendStatus(500);
  }
};
