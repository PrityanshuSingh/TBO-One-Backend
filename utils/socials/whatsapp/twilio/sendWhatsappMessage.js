const id = process.env.TWILIO_ACCONT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;

// Importing the Twilio module 
const twilio = require('twilio');

// Creating a client 
const client = twilio(id, token);

const sendWhatsappMessage = async (to, body, mediaUrl) => {
    if (!Array.isArray(mediaUrl)) {
        mediaUrl = [mediaUrl];
    }

    try {
        const message = await client.messages.create({
            body,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${to}`,
            mediaUrl
        });

        console.log("Message sent successfully:", message);
        return message.sid;
    } catch (error) {
        console.error("Error in Twilio API:", error);
        throw new Error("Twilio API error: " + error.message); // Ensure error is properly thrown
    }
};
module.exports = sendWhatsappMessage;