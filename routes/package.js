const express = require('express');
const { createPackage } = require('../controllers/package/createPackage');
const router = express.Router();
router.post("/createPackage", createPackage)
module.exports = router;
