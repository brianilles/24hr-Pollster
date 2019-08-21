const router = require('express').Router();

// model imports
const Users = require('./usersModel.js');

// service imports
const AuthService = require('./auth/authServices.js');

// gets a user's info
router.get('/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;

  try {
    // check if jwt roles match
    const authorized = await AuthService.withRole(id, req, res);

    // if authorized, meaning role on the JWT
    if (authorized) {
      // get the user from the DB
      const user = await Users.findBy({ id });
      if (user) {
        res.status(200).json(user);
      } else {
        // res.status(404).json({ message: 'User not found.' }); below is more cryptic
        res.status(403).json({ message: 'No Access. Invalid token.' });
      }
    } else {
      res.status(403).json({ message: 'No Access. Invalid token.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occurred.' });
  }
});

// deletes a user
router.delete('/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;

  try {
    // check if jwt roles match
    const authorized = await AuthService.withRole(id, req, res);

    // if authorized, meaning role on the JWT
    if (authorized) {
      // get the user from the DB
      const user = await Users.remove({
        id
      });
      if (user) {
        res.status(204).end();
      } else {
        res.status(500).json({
          message: 'An error occured. The user was likely recently deleted.'
        });
      }
    } else {
      res.status(403).json({
        message: 'No Access. Invalid token.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occured.' });
  }
});

module.exports = router;
