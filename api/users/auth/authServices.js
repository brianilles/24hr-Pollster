const jwt = require('jsonwebtoken');
const secret = require('./secret.js').jwtSecret;

module.exports = {
  generateToken,
  withRole
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

// check if jwt roles match
function withRole(id, req, res) {
  if (
    req.decodedJwt &&
    req.decodedJwt.roles &&
    req.decodedJwt.roles.includes(id)
  ) {
    return true;
  } else {
    return false;
  }
}
