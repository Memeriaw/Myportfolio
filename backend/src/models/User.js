const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  fingerprint: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
