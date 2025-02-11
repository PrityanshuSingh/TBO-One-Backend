const express = require('express');
const { getPackagesByCampaign } = require('../controllers/campain/getPackagesByCampaign');
const { createInterest } = require('../controllers/campain/createInterest');
const { imageUpload } = require('../middleware/upload');

const router = express.Router();
router.get('/', getPackagesByCampaign);
router.post('/interest', createInterest);

module.exports = router;
