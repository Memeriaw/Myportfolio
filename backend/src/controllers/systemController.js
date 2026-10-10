const getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'API healthy',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { getHealth };
