const express = require('express');
const { getAgentPackages } = require('../controllers/package/getAgentPackages');
const { recommendPackage } = require('../controllers/package/recommendPackage');
const { recommendNewPackage } = require('../controllers/package/recommendNewPackage');
const { savePackage, unsavePackage } = require('../controllers/package/savePackage');
const { imageUpload } = require('../middleware/upload');
const router = express.Router();

router.get('/', getAgentPackages);
router.post('/save', savePackage);
router.post('/unsave', unsavePackage);
router.post('/generate', imageUpload.none(), recommendPackage);
router.post('/customize', imageUpload.none(), recommendNewPackage);

module.exports = router;
