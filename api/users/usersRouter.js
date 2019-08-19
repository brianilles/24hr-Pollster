const router = require('express').Router();
const Users = require('./usersModel.js');

// Gets a user's info
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // check if jwt roles match
  const authorized = withRole(id, req, res);
  if (authorized) {
    const user = await Users.findBy({ id });
    if (user) {
      res.status(200).json(user);
    } else {
      //   res.status(404).json({ message: 'User not found.' }); below is more cryptic
      res.status(403).json({ message: 'No Access. Invalid token.' });
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

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

// Deletes a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // check if jwt roles match
  const authorized = withRole(id, req, res);
  if (authorized) {
    const user = await Users.remove({ id });
    if (user) {
      res.status(204).end();
    } else {
      res.status(500).json({
        message: 'An error occured. The user was likely deleted.'
      });
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

module.exports = router;
