const axios = require("axios");

async function generateImage(req, res) {
  try {
    // Extract prompt parameter from the frontend request body
    const { prompt } = req.body;

    const requestData = {
      inputs: prompt,
      parameters: {
        seed: 0,
        width: 1024,
        height: 1024,
        num_inference_steps: 4,
      },
    };

    // Call the Flux API on Hugging Face
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      requestData,
      {
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // Retrieve binary image data
      }
    );

    console.log("HF Response:", hfResponse.status, hfResponse.statusText);
    // Determine the content type returned from the API
    const contentType = hfResponse.headers["content-type"] || "image/webp";

    // Convert the binary data to a base64-encoded string
    const base64Image = Buffer.from(hfResponse.data, "binary").toString("base64");

    // Build a data URL so the frontend can directly use it in an <img> tag
    const dataUrl = `data:${contentType};base64,${base64Image}`;

    res.status(200).json({ imageUrl: dataUrl });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: "Image generation failed" });
  }

  // try {
  //     // Extract key details from the incoming JSON data
  //     const {
  //         packageTitle,
  //         location,
  //         duration,
  //         shortDescription,
  //         // You can extract additional fields if needed
  //     } = req.body;
  //     const prompt = `Generate a captivating image for the travel package "${packageTitle}" located in ${location}. The package lasts for ${duration} and is described as: "${shortDescription}".`;
  //     const result = await model.generateContent(prompt);
  //     const imageUrl = result.response.image();
  //     console.log("Generated Image URL:", imageUrl);
  //     res.status(200).json({ imageUrl });
  // } catch (error) {
  //     console.error("Error generating image:", error);
  //     res.status(500).json({ error: "Failed to generate image" });
  // }
}

module.exports = {generateImage};