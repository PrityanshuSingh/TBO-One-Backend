const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateCaption(req, res) {
  try {
    // Extract key details from the incoming JSON data
    const {
      packageTitle,
      location,
      duration,
      shortDescription
      // You can extract additional fields if needed
    } = req.body;
    const prompt = `Generate a captivating caption for the travel package "${packageTitle}" located in ${location}. The package lasts for ${duration} and is described as: "${shortDescription}". Strictly generate a caption with no explanation.`;
    const result = await model.generateContent(prompt);
    const caption = result.response.text();
    console.log("Generated Caption:", caption);
    res.status(200).json({ caption });
  } catch (error) {
    console.error("Error generating caption:", error);
    res.status(500).json({ error: "Failed to generate caption" });
  }
}

module.exports = generateCaption;