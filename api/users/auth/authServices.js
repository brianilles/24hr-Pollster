const jwt = require('jsonwebtoken');
const secret = require('./secret.js').jwtSecret;

// models import
const Users = require('../usersModel.js');

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
async function withRole(id, req, res) {
  // get user from db
  try {
    const user = await Users.findBy({ id });
    if (
      user &&
      req.decodedJwt &&
      req.decodedJwt.roles &&
      req.decodedJwt.roles.includes(id)
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
