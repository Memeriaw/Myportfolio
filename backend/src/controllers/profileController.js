const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const { getStore } = require('../utils/store');

const getProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      return res.json({ success: true, data: store.profile });
    }

    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;

    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      store.profile = { ...store.profile, ...updates, updatedAt: new Date().toISOString() };
      return res.json({ success: true, message: 'Profile updated successfully.', data: store.profile });
    }

    const profile = await Profile.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Profile updated successfully.', data: profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
