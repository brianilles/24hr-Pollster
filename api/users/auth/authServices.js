const jwt = require('jsonwebtoken');
const secret = require('./secret.js').jwtSecret;

module.exports = {
  generateToken
};

// creates a JWT with the user id on roles
function generateToken(user) {
  const payload = {
    subject: user.id,
    roles: [`${user.id}`]
  };
  const options = {
    expiresIn: '120d'
  };
  return jwt.sign(payload, secret, options);
}
