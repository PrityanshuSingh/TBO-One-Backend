const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fs = require("fs");

// Converts local file information to base64
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      // data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      data: path.split("base64,")[1],
      mimeType
    },
  };
}

async function generateCaption(req, res) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
    // const prompt = "summarise the photo.";
    const prompt = req.body.prompt + "Generate a creative Instagram caption for the provided image that reflects the specific themes and tones given. The caption should evoke a sense of travel and adventure, capturing the essence of wanderlust. Include relevant hashtags related to exploration and the overall mood. Do not include any explanations or descriptions of the photo—only provide the caption text.";
    const imageParts = [
      fileToGenerativePart(req.body.imageUrl, "image/jpeg")
    ];
  
    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    console.log(generatedContent.response.text());
    res.json({ caption: generatedContent.response.text() });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateCaption };