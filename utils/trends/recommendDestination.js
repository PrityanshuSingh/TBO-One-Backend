const axios = require("axios");

async function recommendDestination(userData) {
    try {
        const { age, origin, travel_style, placesVisited } = userData;

        // Prepare the request payload
        const requestData = {
            age,
            origin,
            travel_style,
            placesVisited
        };

        // Make a request to the recommendation API
        const response = await axios.post("https://tborecommendplace.onrender.com/api/recommend", requestData);
        
        // Return recommended destinations
        return response.data;
    } catch (error) {
        console.error("Error fetching hotel recommendations:", error);
        throw error;
    }
}

module.exports = recommendDestination;