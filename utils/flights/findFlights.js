const axios = require('axios');

const findFlights = async (endUserIp, tokenId, adultCount, childCount, infantCount, directFlight, oneStopFlight, journeyType, preferredAirlines, segments, sources) => {
    try {
        // const endUserIp = req.ip || req?.connection?.remoteAddress;

        const url = 'http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search';

        const data = {
            EndUserIp: endUserIp,
            TokenId: tokenId,
            AdultCount: adultCount,
            ChildCount: childCount,
            InfantCount: infantCount,
            DirectFlight: directFlight,
            OneStopFlight: oneStopFlight,
            JourneyType: journeyType,
            PreferredAirlines: preferredAirlines,
            Segments: segments,
            Sources: sources
        };

        const response = await axios.post(url, data);
        console.log("flight data  : ", response.data)
        return response.data;
    } catch (error) {
        console.error("Flight Search Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = findFlights;
