const express = require('express');
const { getPackagesByCampaign } = require('../controllers/campain/getPackagesByCampaign');
const { imageUpload } = require('../middleware/upload');

const router = express.Router();
router.get('/', getPackagesByCampaign);

module.exports = router;
