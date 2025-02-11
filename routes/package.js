const express = require('express');
const { getAgentPackages } = require('../controllers/package/getAgentPackages');
const { recommendPackage } = require('../controllers/package/recommendPackage');
const { recommendNewPackage } = require('../controllers/package/recommendNewPackage');
const { imageUpload } = require('../middleware/upload');
// const { createPackage } = require('../controllers/package/createPackage');
const router = express.Router();
// router.post("/createPackage", createPackage)
router.get('/', getAgentPackages)
router.post('/generate', imageUpload.none(), recommendPackage)
router.post('/customize', imageUpload.none(), recommendNewPackage)
module.exports = router;
