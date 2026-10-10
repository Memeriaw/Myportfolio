const { matchedData } = require('express-validator');

const normalizeBody = (req, res, next) => {
  if (req.body) {
    req.body = matchedData(req, { locations: ['body'] });
  }
  next();
};

module.exports = normalizeBody;
