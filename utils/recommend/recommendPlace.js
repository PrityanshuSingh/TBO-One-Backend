async function getRecommendations(payload) {
  try {
    const payload = req.body;
    // Adjust the URL and port according to your Flask API configuration.
    const response = await axios.post(process.env.FLASK_RECOMMEND_PLACE_URI, payload);
    return response.data;
  } catch (error) {
    console.error("Error calling Flask API:", error.message);
    
    // If the error contains a response from the Flask API, throw that error message.
    if (error.response && error.response.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    
    // Otherwise, throw a generic error.
    throw new Error("Internal Server Error while calling Flask API");
  }
}

module.exports = {
  getRecommendations,
};