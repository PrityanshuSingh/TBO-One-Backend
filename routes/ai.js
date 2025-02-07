const express = require('express');
const { getTemplate } = require('../controllers/campain/template/getTemplate');
const generateCaption = require('../utils/genai/generateCaption');
const generateWpDesc = require('../utils/genai/generateWpDesc');
const router = express.Router();
router.get("/templates", getTemplate);
router.use("/packages",require('./package'))
router.post("/caption", generateCaption);
router.post("/wpDescription", generateWpDesc);
module.exports = router;
