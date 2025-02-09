const axios = require('axios');

const searchFlights = async (options) => {
    try {

        const url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search';

        const response = await axios.post(url, options);
        console.log("flight data  : ", response.data)
        return response.data.Response.Results;
    } catch (error) {
        console.error("Flight Search Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = searchFlights;
