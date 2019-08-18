const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('./secret').jwtSecret;

const Users = require('../usersModel.js');

// TODO: add check for valid phone
router.post('/register', async (req, res) => {
  // user info passed in request body
  let user = req.body;
  const { full_name, email, phone_number, password } = user;

  // incorrect usage
  if (!full_name || !email || !phone_number || !password) {
    res.status(422).json({
      message: 'Must provide full_name, email, phone_number, and password.'
    });
  }

  // check if the email and phone are already present on the DB
  const emailCheck = await Users.findBy({ email });
  const phoneNumberCheck = await Users.findBy({ phone_number });

  if (emailCheck && phoneNumberCheck) {
    res
      .status(405)
      .json({ message: 'Email and phone number are already taken.' });
  } else if (emailCheck) {
    res.status(405).json({ message: 'Email already taken.' });
  } else if (phoneNumberCheck) {
    res.status(405).json({ message: 'Phone number already taken.' });
  } else {
    // correct usage
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    try {
      await Users.add(user);
      const addedUser = await Users.findBy({ email });
      res.status(201).json(addedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'An unknown error occured. User could not be added.'
      });
    }
  }
});

module.exports = router;
