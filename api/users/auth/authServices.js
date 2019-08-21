const jwt = require('jsonwebtoken');
const secret = require('./secret.js').jwtSecret;

// models import
const Users = require('../usersModel.js');
const Polls = require('../../polls/pollsModel.js');

module.exports = {
  generateToken,
  withRole,
  withPollOwnership
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
  try {
    // get user from db
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

async function withPollOwnership(pollId, id, req, res) {
  try {
    // get the user's polls id
    const pollUser = await Polls.findByPollId(pollId);

    // if those the pollId is under their ownership, return true
    if (pollUser.user_id == id) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
