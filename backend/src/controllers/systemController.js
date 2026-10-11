const mongoose = require('mongoose');

const getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'API healthy',
    data: {
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory',
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { getHealth };
