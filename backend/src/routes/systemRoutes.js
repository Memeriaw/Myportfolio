const express = require('express');
const { getHealth } = require('../controllers/systemController');

const router = express.Router();
router.get('/health', getHealth);

module.exports = router;
