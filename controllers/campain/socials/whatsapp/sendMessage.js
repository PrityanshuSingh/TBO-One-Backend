const sendWhatsappMessage = require("../../../../utils/socials/whatsapp/twilio/sendWhatsappMessage");
const Contact = require("../../../../models/Customer");
const Group = require("../../../../models/Group");
const Package = require("../../../../models/Package");

exports.sendMessage = async (req, res, next) => {
  try {
    // console.log("Logging request body:", req.body);

    let groupIdsArray = [];
    let contactIdsArray = [];
    try {
      groupIdsArray = JSON.parse(req.body.groupIds || "[]");
      contactIdsArray = JSON.parse(req.body.contactIds || "[]");
    } catch (error) {
      console.error("Invalid JSON:", error);
      return res.status(400).json({ error: "Invalid format in request" });
    }

    // Format the incoming message:
    let formattedMessage = req.body.message || "";
    // Normalize line breaks (replace CRLF with LF)
    formattedMessage = formattedMessage.replace(/\r\n/g, "\n\n");
    // Replace a line starting with "Details:" with "View Details:" 
    formattedMessage = formattedMessage.replace(/^Details:\s*(.*)$/m, `View Details: ${req.body.DetailsUrl}\n`);

    // Append image URL (if provided) so that the WhatsApp message shows the image link
    // if (req.body.imageUrl) {
    //   formattedMessage += `\n\nDestination Image: ${req.body.imageUrl}\n`;
    // }

    // ---------- Fetch Contact Numbers for Individual Contact IDs ----------
    let contactNumbers = [];
    if (contactIdsArray.length > 0) {
      const contacts = await Contact.find({ _id: { $in: contactIdsArray } });
      // Assume each contact document has a field "whatsApp" with the phone number
      contactNumbers = contacts.map(contact => contact.whatsApp);
    }

    // ---------- Fetch Groups, Extract Contact IDs, and Get Their Phone Numbers ----------
    let groupContactNumbers = [];
    if (groupIdsArray.length > 0) {
      const groups = await Group.find({ _id: { $in: groupIdsArray } });
      // Accumulate all contact IDs from the groups
      const groupContactIds = groups.reduce((acc, group) => {
        if (group.contactId && Array.isArray(group.contactId)) {
          return acc.concat(group.contactId);
        }
        return acc;
      }, []);

      // Remove duplicates (convert ObjectIDs to strings)
      const uniqueGroupContactIds = [...new Set(groupContactIds.map(id => id.toString()))];
      if (uniqueGroupContactIds.length > 0) {
        const groupContacts = await Contact.find({ _id: { $in: uniqueGroupContactIds } });
        groupContactNumbers = groupContacts.map(contact => contact.whatsApp);
      }
    }

    console.log("Group Contact Numbers:", groupContactNumbers);

    // ---------- Combine and Deduplicate All Phone Numbers ----------
    const allPhoneNumbers = [...contactNumbers, ...groupContactNumbers];
    const uniquePhoneNumbers = [...new Set(allPhoneNumbers)];

    console.log("Unique Phone Numbers:", uniquePhoneNumbers);

    const fetchPackage = await Package.findOne({ _id: req.body.packageId });
    mediaUrl = fetchPackage?.image || null;

    // ---------- Loop through each number and send the message ----------
    for (const number of uniquePhoneNumbers) {
      await sendWhatsappMessage(number, formattedMessage, mediaUrl);
    }

    res.status(201).json({ message: "Message sent successfully", body: formattedMessage });
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.sendStatus(500);
  }
};
