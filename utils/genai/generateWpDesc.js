const { GoogleGenerativeAI } = require("@google/generative-ai");
const Package = require("../../models/Package");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateWpDesc(req, res) {
  try {
    // Extract key details from the incoming JSON data
    // const {
    //   packageTitle,
    //   location,
    //   duration,
    //   shortDescription
    //   // You can extract additional fields if needed
    // } = req.body;

    const { packageId, email } = req.body;
    console.log(req.body);
    console.log(req.body["_id"]);
    const package = await Package.findById(req.body["_id"]);
    console.log(package);
    const prompt = `Generate a captivating WhatsApp Description for the travel package "${package}". Strictly generate a caption with no explanation.`;
    const result = await model.generateContent(prompt);
    const caption = result.response.text();
    console.log("Generated Wp Description:", caption);
    res.status(200).json({ caption });
  } catch (error) {
    console.error("Error generating description:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
}

module.exports = generateWpDesc;