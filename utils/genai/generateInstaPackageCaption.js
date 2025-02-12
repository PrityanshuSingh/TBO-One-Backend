const { GoogleGenerativeAI } = require("@google/generative-ai");
const Package = require("../../models/Package");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateInstaPackageCaption(req, res) {
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
    const package = await Package.findById(packageId);
    console.log("package",package);
    const prompt = `Craft a captivating and enticing instagram caption for the campaign post for the travel package titled '${package}'. The description should be highly engaging and written in vivid and not that long, dont add any options or heading, just keep it one caption and use imaginative language that inspires wanderlust and encourages users to click the provided link. Focus solely on the allure of the travel experience, using persuasive and descriptive adjectives to paint a picture of adventure and discovery, without including any numerical details since those are already present in the subheading of the message. Make sure to inlcude relevant instagram hashtags to increase visibility and engagement."`;
    const result = await model.generateContent(prompt);
    const caption = result.response.text();
    console.log("Generated Wp Description:", caption);
    res.status(200).json({ caption });
  } catch (error) {
    console.error("Error generating description:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
}

module.exports = generateInstaPackageCaption;