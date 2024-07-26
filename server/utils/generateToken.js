const jwt = require('jsonwebtoken');

const generateToken = (payload, secret, options = { expiresIn: '1h' }) => {
  return jwt.sign(payload, secret, options);
};

module.exports = {
  generateToken
};
