const mongoose = require('mongoose');
const Project = require('../models/Project');
const { getStore } = require('../utils/store');

const buildSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const getProjects = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const { projects } = getStore();
      const { category, featured } = req.query;
      let filteredProjects = [...projects];

      if (category) filteredProjects = filteredProjects.filter((project) => project.category === category);
      if (featured !== undefined) filteredProjects = filteredProjects.filter((project) => project.featured === (featured === 'true'));

      return res.json({ success: true, data: filteredProjects });
    }

    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const project = store.projects.find((item) => item.slug === req.params.slug);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
      return res.json({ success: true, data: project });
    }

    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload.title) {
      return res.status(400).json({ success: false, message: 'Project title is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const project = {
        _id: `project-${Date.now()}`,
        ...payload,
        slug: payload.slug || buildSlug(payload.title),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.projects.unshift(project);
      return res.status(201).json({ success: true, message: 'Project created successfully.', data: project });
    }

    payload.slug = payload.slug || buildSlug(payload.title);
    const project = await Project.create(payload);
    res.status(201).json({ success: true, message: 'Project created successfully.', data: project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.body._id;
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project id is required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const projectIndex = store.projects.findIndex((item) => item._id === projectId || item.slug === projectId);
      if (projectIndex === -1) return res.status(404).json({ success: false, message: 'Project not found.' });
      const payload = { ...store.projects[projectIndex], ...req.body, updatedAt: new Date().toISOString() };
      if (payload.title && !payload.slug) payload.slug = buildSlug(payload.title);
      store.projects[projectIndex] = payload;
      return res.json({ success: true, message: 'Project updated successfully.', data: payload });
    }

    const payload = { ...req.body };
    delete payload._id;
    if (payload.title && !payload.slug) {
      payload.slug = buildSlug(payload.title);
    }

    const project = await Project.findByIdAndUpdate(projectId, payload, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.json({ success: true, message: 'Project updated successfully.', data: project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const index = store.projects.findIndex((item) => item._id === req.params.id || item.slug === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Project not found.' });
      store.projects.splice(index, 1);
      return res.json({ success: true, message: 'Project deleted successfully.' });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProjectBySlug, createProject, updateProject, deleteProject };
