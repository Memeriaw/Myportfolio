const express = require('express');
const { body } = require('express-validator');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getSkills);
router.post('/', requireAuth, [
  body('name').notEmpty().withMessage('Skill name is required.'),
  body('category').notEmpty().withMessage('Category is required.'),
], validateRequest, createSkill);
router.put('/:id', requireAuth, [
  body('name').optional().notEmpty(),
  body('category').optional().notEmpty(),
], validateRequest, updateSkill);
router.delete('/:id', requireAuth, deleteSkill);

module.exports = router;
