const express = require('express');
const { getAgentPackages } = require('../controllers/package/getAgentPackages');
// const { createPackage } = require('../controllers/package/createPackage');
const router = express.Router();
// router.post("/createPackage", createPackage)
router.get('/', getAgentPackages)
module.exports = router;
