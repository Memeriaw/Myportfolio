const crypto = require('crypto');

let developmentJwtSecret;

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production.');
  }

  developmentJwtSecret ||= crypto.randomBytes(32).toString('hex');
  return developmentJwtSecret;
};

const getAdminCredentials = () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured.');
  }

  return { email, password };
};

const validateSecurityConfig = () => {
  getJwtSecret();
  getAdminCredentials();
};

module.exports = { getJwtSecret, getAdminCredentials, validateSecurityConfig };
