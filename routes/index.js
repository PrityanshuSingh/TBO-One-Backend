const express = require('express');
const router = express.Router();
router.use("/auth",require('./auth'));
router.use("/packages",require('./package'))
router.use("/whatsapp",require('./whatsapp'))
router.use("/ai",require('./ai'));
router.use("/instagram",require("./instagram"))
module.exports = router;
