const express = require('express');
const router = express.Router();
router.use("/package",require('./package'))
router.use("/whatsapp",require('./whatsapp'))
module.exports = router;
