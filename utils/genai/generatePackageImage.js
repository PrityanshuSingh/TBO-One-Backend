const axios = require("axios");
const qs = require("qs");
const path = require("path");
const fs = require("fs").promises;
const uploadImage = require('../../utils/image/uploadImage');

async function generatePackageImage(prompt) {
  try {

    console.log("Generating image with prompt:", prompt);
    const requestData = {
      inputs: prompt,
      parameters: {
        seed: 0,
        width: 1024,
        height: 1024,
        num_inference_steps: 4,
      },
    };

    // Request image generation from the Hugging Face (Flux) API
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      requestData,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    console.log("HF Response:", hfResponse.status, hfResponse.statusText);

    // Determine the content type (default to image/webp if not provided)
    const contentType = hfResponse.headers["content-type"] || "image/webp";

    // Convert the binary data to a base64 string
    const base64Image = Buffer.from(hfResponse.data, "binary").toString("base64");

    // Determine file extension based on the content type
    let extension = "png";
    if (contentType.includes("jpeg")) {
      extension = "jpg";
    } else if (contentType.includes("webp")) {
      extension = "webp";
    }

    // Create a temporary file path for the image
    const tempFilePath = path.join(__dirname, `image_${Date.now()}.${extension}`);

    // Write the base64 image to the temporary file (using base64 encoding)
    await fs.writeFile(tempFilePath, base64Image, { encoding: "base64" });

    // Upload the temporary file to Cloudinary using your uploadImage function
    const cloudinaryResponse = await uploadImage(tempFilePath);

    // Return the secure URL provided by Cloudinary
    return cloudinaryResponse.secure_url;
  } catch (error) {
    console.error("Error generating image:", error.message);
    return null;
  }
}

module.exports = generatePackageImage;
