const mongoose = require('mongoose');
const Message = require('../models/Message');
const { getStore } = require('../utils/store');

const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const fingerprint = `${email.trim().toLowerCase()}|${subject.trim().toLowerCase()}|${message.trim()}`;
      const recentDuplicate = store.messages.find((item) => item.fingerprint === fingerprint && new Date(item.createdAt) > new Date(Date.now() - 60 * 1000));
      if (recentDuplicate) {
        return res.status(409).json({ success: false, message: 'This message was already submitted recently. Please wait a moment and try again.' });
      }

      const createdMessage = {
        _id: `message-${Date.now()}`,
        name,
        email,
        subject,
        message,
        fingerprint,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      store.messages.unshift(createdMessage);
      return res.status(201).json({ success: true, message: 'Message sent successfully.', data: createdMessage });
    }

    const fingerprint = `${email.trim().toLowerCase()}|${subject.trim().toLowerCase()}|${message.trim()}`;
    const recentDuplicate = await Message.findOne({
      fingerprint,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (recentDuplicate) {
      return res.status(409).json({ success: false, message: 'This message was already submitted recently. Please wait a moment and try again.' });
    }

    const createdMessage = await Message.create({ name, email, subject, message, fingerprint });
    res.status(201).json({ success: true, message: 'Message sent successfully.', data: createdMessage });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const { messages } = getStore();
      return res.json({ success: true, data: messages });
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

const markMessageRead = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const message = store.messages.find((item) => item._id === req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Message not found.' });
      message.isRead = true;
      return res.json({ success: true, message: 'Message marked as read.', data: message });
    }

    const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, message: 'Message marked as read.', data: message });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const store = getStore();
      const index = store.messages.findIndex((item) => item._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Message not found.' });
      store.messages.splice(index, 1);
      return res.json({ success: true, message: 'Message deleted successfully.' });
    }

    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMessage, getMessages, markMessageRead, deleteMessage };
