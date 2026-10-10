const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFoundHandler, errorHandler };
