const express = require('express');
const { getTemplate } = require('../controllers/campain/template/getTemplate');
const { generateCaption } = require('../utils/genai/generateCaption');
const {generateImage} = require('../utils/genai/generateImage');
const {imageUpload} = require('../middleware/upload');
const generateWpDesc = require('../utils/genai/generateWpDesc');

const router = express.Router();
router.get("/templates", getTemplate);
router.use("/packages",require('./package'))
router.post("/caption", imageUpload.none(), generateCaption);
router.post("/image", generateImage);
router.post("/wpDescription", generateWpDesc);
module.exports = router;