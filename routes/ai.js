const express = require('express');
const { getTemplate } = require('../controllers/campain/template/getTemplate');
const router = express.Router();
router.get("/templates", getTemplate);
module.exports = router;
