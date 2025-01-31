const id = process.env.TWILIO_ACCONT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;

// Importing the Twilio module 
const twilio = require('twilio');

// Creating a client 
const client = twilio(id, token);

const sendWhatsappMessage = async (to, body, mediaUrl) => {

    if(!Array.isArray(mediaUrl)){
        mediaUrl = [mediaUrl]
    }

    // Sending messages to the client 
    client.messages
        .create({

            // Message to be sent 
            body,

            // Senders Number (Twilio Sandbox No.) 
            from: 'whatsapp:+14155238886',

            // Number receiving the message 
            to: `whatsapp:${to}`,

            mediaUrl
        })
        .then(message => console.log("Message sent successfully"))
        .catch(error => console.log("error", error));
}

module.exports = sendWhatsappMessage;