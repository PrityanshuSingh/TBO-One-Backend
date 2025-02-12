const express = require('express');
const { getTemplate } = require('../controllers/campain/template/getTemplate');
const { generateCaption } = require('../utils/genai/generateCaption');
const {generateImage} = require('../utils/genai/generateImage');
const generateWpDesc = require('../utils/genai/generateWpDesc');
const generateInstaPackageCaption = require('../utils/genai/generateInstaPackageCaption');

const {imageUpload} = require('../middleware/upload');
const uploadImage = require('../utils/image/uploadImage');

const router = express.Router();
router.get("/templates", getTemplate);
router.use("/packages",require('./package'))
router.post("/caption", imageUpload.none(), generateCaption);
router.post("/instagrampackageCaption", generateInstaPackageCaption);
router.post("/image", generateImage);
router.post("/wpDescription", generateWpDesc);

router.post('/hostImage', imageUpload.none(), async (req, res) => {
    try {
        const { image } = req.body;
        const response = await uploadImage(image);
        console.log(response);
        res.status(200).json({ imageURL: response.secure_url })
    } catch (error) {
        console.log("Error uploading image", error.message);
        try {
            console.log("tring by jpeg");
            
            // Convert Base64 to Buffer
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');

            // Save the buffer as a temporary file
            const tempFilePath = path.join(__dirname, `image_${Date.now()}.png`);

            // Upload the file to Cloudinary
            const response = await uploadImage(tempFilePath);
            res.status(200).json({ imageURL: response.secure_url })
        } catch (error) {
            res.status(500).json({ error: "Internal Server erroe" })
        }
    }
})
module.exports = router;