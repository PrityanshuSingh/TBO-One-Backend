// generateEmbedding.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function generateEmbedding(content) {
    console.log("Entering generate embading function")
    try {
        const result = await model.embedContent(content);
        console.log("generated embedding : ", result.embedding.values)
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

module.exports = generateEmbedding;
