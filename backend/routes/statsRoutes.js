const express = require('express');
const { getTransparencyStats } = require('../controllers/statsController');
const router = express.Router();

router.get('/', getTransparencyStats);

module.exports = router;
