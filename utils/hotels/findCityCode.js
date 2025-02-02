const axios = require('axios');
const base64 = require('base-64');
const Fuse = require('fuse.js');

const findCityCode = async (cityName, CountryCode) => {
    const url = `${process.env.TBO_HOTEL_BASE_URL}/CityList`;
    const username = process.env.TBO_HOTEL_USERNAME;
    const password = process.env.TBO_HOTEL_PASSWORD;

    const basicAuth = base64.encode(`${username}:${password}`);
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
    };

    const data = { CountryCode };

    console.log("Data", data)

    try {
        // Fetch data from the API
        const response = await axios.post(url, data, { headers });

        // Validate and extract CityList
        if (response.data && response.data.Status.Code === 200) {
            const cityList = response.data.CityList || [];

            if(!cityName){
                return cityList;
            }

            // Perform fuzzy matching using Fuse.js
            const matches = matchCityName(cityList, cityName);
            console.log("matches",matches)
            // Return up to 10 matches
            return matches.slice(0, 10);
        } else {
            throw new Error('Invalid response from CityList API');
        }
    } catch (error) {
        console.error('Error fetching city codes:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Helper function to match city names using Fuse.js
const matchCityName = (cityList, cityName) => {
    if (!cityList || cityList.length === 0) return [];

    // Configure Fuse.js options
    const options = {
        keys: ['Name'], // Search within the "Name" field of each city
        threshold: 0.1, // Sensitivity (lower = stricter matching, higher = more lenient)
        includeScore: true, // Include match score in results
    };

    const fuse = new Fuse(cityList, options);

    // Perform the search
    const results = fuse.search(cityName);

    // Return the matched cities in the desired format
    return results.map(result => ({
        ...result.item, // Original city object
        score: result.score, // Add relevance score
    }));
};

module.exports = findCityCode;
