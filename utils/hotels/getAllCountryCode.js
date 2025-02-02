const axios = require('axios')
const base64 = require('base-64')

const getAllCountryCode = async () => {
    try {
        const url = `${process.env.TBO_HOTEL_BASE_URL}/CountryList`
        const username = process.env.TBO_HOTEL_USERNAME;
        const password = process.env.TBO_HOTEL_PASSWORD;
        const basicAuth = base64.encode(`${username}:${password}`);

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
        };
        const response = await axios.get(url, { headers });
        if (!response) {
            return new Error("No response found for the given CityCode");
        }

        console.log("response", response.data)

        return response.data.CountryList;

    }
    catch (error) {
        throw error
    }
}

module.exports = getAllCountryCode