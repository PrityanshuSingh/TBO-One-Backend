const express = require('express');
const router = express.Router();
router.use("/packages",require('./package'))
router.use("/whatsapp",require('./whatsapp'))
module.exports = router;
