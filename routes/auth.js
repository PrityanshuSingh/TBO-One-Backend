const express = require('express');
const login = require('../controllers/auth/login');
const router = express.Router();
router.post('/login',login)
router.use('/instagram',require('./instagram'))

module.exports = router;
