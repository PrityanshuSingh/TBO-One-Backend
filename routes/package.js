const express = require('express');
const { getAgentPackages } = require('../controllers/package/getAgentPackages');
const { recommendPackage } = require('../controllers/package/recommendPackage');
const { imageUpload } = require('../middleware/upload');
// const { createPackage } = require('../controllers/package/createPackage');
const router = express.Router();
// router.post("/createPackage", createPackage)
router.get('/', getAgentPackages)
router.post('/generate', imageUpload.none(), recommendPackage)
module.exports = router;
