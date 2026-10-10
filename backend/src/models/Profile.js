const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  bio: { type: String, default: '' },
  email: { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  education: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    telegram: { type: String, default: '' },
    youtube: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
