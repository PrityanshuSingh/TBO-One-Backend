const sendWhatsappMessage = require("../../../../utils/socials/whatsapp/twilio/sendWhatsappMessage");
exports.sendMessage = async (req, res, next) => {
    try {
        console.log("Logging request body:", req.body);

        let groupIdsArray, contactIdsArray;
        try {
            groupIdsArray = JSON.parse(req.body.groupIds);
            contactIdsArray = JSON.parse(req.body.contactIds);
        } catch (error) {
            console.error("Invalid JSON:", error);
            return res.status(400).json({ error: "Invalid  format in request" });
        }

        try {
            // Await the function and catch errors
            await sendWhatsappMessage('+918279420073', req.body.message);
            res.status(201).json({ message: "Message sent successfully" });
        } catch (error) {
            console.error("Error in sending WhatsApp message:", error);
            res.status(400).json({ error: "Failed to send WhatsApp message" });
        }

    } catch (error) {
        console.error("Unexpected server error:", error);
        res.sendStatus(500);
    }
};

