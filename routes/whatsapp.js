const express = require('express');
const { sendMessage } = require('../controllers/campain/socials/whatsapp/sendMessage');
const { imageUpload } = require('../middleware/upload');
const router = express.Router();
router.post("/send", imageUpload.any(), sendMessage)
module.exports = router;
