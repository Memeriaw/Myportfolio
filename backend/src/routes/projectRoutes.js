const express = require('express');
const { body } = require('express-validator');
const { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', requireAuth, [
  body('title').notEmpty().withMessage('Title is required.'),
  body('description').notEmpty().withMessage('Description is required.'),
], validateRequest, createProject);
router.put('/:id', requireAuth, [
  body('title').optional().notEmpty(),
], validateRequest, updateProject);
router.delete('/:id', requireAuth, deleteProject);

module.exports = router;
