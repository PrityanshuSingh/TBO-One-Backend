const express = require('express');
const { getPackagesByCampaign } = require('../controllers/campain/getPackagesByCampaign');
const { createInterest } = require('../controllers/campain/createInterest');
const { imageUpload } = require('../middleware/upload');
const { getAgentCampaigns } = require('../controllers/campain/getAgentCampains');

const router = express.Router();
router.get('/', getAgentCampaigns);
router.get('/packages', getPackagesByCampaign);
router.post('/interest', createInterest);

module.exports = router;
