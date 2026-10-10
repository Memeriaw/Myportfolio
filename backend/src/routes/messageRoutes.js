const express = require('express');
const { body } = require('express-validator');
const { createMessage, getMessages, markMessageRead, deleteMessage } = require('../controllers/messageController');
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/', [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email required.'),
  body('subject').notEmpty().withMessage('Subject is required.'),
  body('message').notEmpty().withMessage('Message is required.'),
], validateRequest, createMessage);
router.get('/', requireAuth, getMessages);
router.patch('/:id/read', requireAuth, markMessageRead);
router.delete('/:id', requireAuth, deleteMessage);

module.exports = router;
