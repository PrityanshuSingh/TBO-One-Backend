const axios = require('axios');

const authenticate = async (req, clientId, userName, password) => {
    try {
        const endUserIp = req.ip || req.connection.remoteAddress; // Extract IP from request

        const url = 'http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': '••••••' // Replace or pass dynamically if needed
        };

        const data = {
            ClientId: clientId,
            UserName: userName,
            Password: password,
            EndUserIp: endUserIp
        };

        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Authentication Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = authenticate;
