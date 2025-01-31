// uploadImage.js
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

const uploadImage = async (
  filePath,
  folder = "MemberImages",
  height = null,
  width = null,
  crop = "limit"
) => {
  try {
    console.log("Uploading file:", filePath);
    const options = {
      folder: folder,
      height: height,
      width: width,
      crop: crop,
    };
    // console.log("Options are", options);
    const result = await cloudinary.uploader.upload(filePath, options);
    fs.unlinkSync(filePath); // Remove file from server after upload to Cloudinary
    console.log("Image uploaded successfully:", result);
    return result;
  } catch (err) {

    fs.unlinkSync(filePath);

    console.error("Error while uploading image:", err);
    throw err;
  }
};

module.exports = uploadImage;
