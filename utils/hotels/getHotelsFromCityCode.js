const axios = require('axios')
const base64 = require('base-64')

const getHotelsFromCityCode = async(CityCode) => {
    const url = `${process.env.TBO_HOTEL_BASE_URL}/TBOHotelCodeList`;
        const username = process.env.TBO_HOTEL_USERNAME;
        const password = process.env.TBO_HOTEL_PASSWORD;
    
        const basicAuth = base64.encode(`${username}:${password}`);
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
        };
    
        const data = { CityCode, IsDetailedResponse: "true" };
    
        try {
            // Fetch data from the API
            const response = await axios.post(url, data, { headers });
            return response.data?.Hotels;
        }
        catch(error){
            console.log("Error fetching hotels ", error);
            
        }
    
}

module.exports = getHotelsFromCityCode;