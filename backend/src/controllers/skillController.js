const mongoose = require('mongoose');
const Skill = require('../models/Skill');
const { getStore } = require('../utils/store');

const getSkills = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const { skills } = getStore();
      return res.json({ success: true, data: skills });
    }

    const items = await Skill.find().sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const payload = req.body;

    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const skill = { _id: `skill-${Date.now()}`, ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      store.skills.push(skill);
      return res.status(201).json({ success: true, message: 'Skill created successfully.', data: skill });
    }

    const skill = await Skill.create(payload);
    res.status(201).json({ success: true, message: 'Skill created successfully.', data: skill });
  } catch (error) {
    next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const index = store.skills.findIndex((item) => item._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Skill not found.' });
      store.skills[index] = { ...store.skills[index], ...req.body, updatedAt: new Date().toISOString() };
      return res.json({ success: true, message: 'Skill updated successfully.', data: store.skills[index] });
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    res.json({ success: true, message: 'Skill updated successfully.', data: skill });
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const index = store.skills.findIndex((item) => item._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Skill not found.' });
      store.skills.splice(index, 1);
      return res.json({ success: true, message: 'Skill deleted successfully.' });
    }

    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
