const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/profileController');
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getProfile);
router.put('/', requireAuth, [
  body('name').optional().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('title').optional().isLength({ min: 2 }),
], validateRequest, updateProfile);

module.exports = router;
