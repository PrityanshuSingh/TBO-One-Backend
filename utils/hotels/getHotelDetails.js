const axios = require('axios')
const base64 = require('base-64')

const getHotelDetails = async (Hotelcodes, Language = "en") => {
    const url = `${process.env.TBO_HOTEL_BASE_URL}/Hoteldetails`;
    const username = process.env.TBO_HOTEL_USERNAME;
    const password = process.env.TBO_HOTEL_PASSWORD;

    const basicAuth = base64.encode(`${username}:${password}`);
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
    };

    const data = { Hotelcodes, Language };

    try {
        // Fetch data from the API
        const response = await axios.post(url, data, { headers });
        console.log("o;o;ij",response.data);
        
        return response.data?.HotelDetails[0];
    }
    catch (error) {
        console.log("Error fetching hotels ", error);

    }

}

module.exports = getHotelDetails;