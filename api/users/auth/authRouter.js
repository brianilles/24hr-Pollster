const router = require('express').Router();
const bcrypt = require('bcryptjs');

// model imports
const Users = require('../usersModel.js');
const UnverifiedUsers = require('../unverifiedUsersModel.js');

// service imports
const AuthService = require('./authServices.js');
const VerificationService = require('./sms/verificationService.js');

// create an unverified user
router.post('/verify', async (req, res) => {
  // user info passed in request body
  let user = req.body;
  const { full_name, email, phone_number, password } = user;

  // incorrect usage
  if (!full_name || !email || !phone_number || !password) {
    res.status(422).json({
      message: 'Must provide full_name, email, phone_number, and password.'
    });
    return;
  }

  try {
    // check if the email and phone are already present in the DB
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

      // check if the email and phone are already present in the DB
      const phoneNumberCheck = await UnverifiedUsers.findBy({
        phone_number
      });

      // if user is already in unverified db
      if (phoneNumberCheck) {
        // delete the old info, add the new info
        await UnverifiedUsers.remove({ id: phoneNumberCheck.id });
      }

      // create hash of password to store in db
      const hash = bcrypt.hashSync(user.password, 12);

      // rewrite the password on user object with the hash
      user.password = hash;

      // add user to DB
      await UnverifiedUsers.add(user);

      // get user object (password omitted)
      const addedUnverifiedUser = await UnverifiedUsers.findBy({ email });

      // send message
      VerificationService.sendCode(user.phone_number);

      // assume message was sent
      addedUnverifiedUser.message_status = 'sent';

      // respond with added user object
      res.status(201).json(addedUnverifiedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An unknown error occured.'
    });
  }
});

// create a user
router.post('/register', async (req, res) => {
  // user info passed in request body
  let user = req.body;
  const { full_name, email, phone_number, password, code } = user;

  // incorrect usage
  if (!full_name || !email || !phone_number || !password) {
    res.status(422).json({
      message: 'Must provide full_name, email, phone_number, and password.'
    });
    return;
  }

  try {
    // check if the email and phone are already present in the DB
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

      // checks that the unverified user exists, gets the id and password from DB
      const userMin = await UnverifiedUsers.findByMin({
        email
      });

      // if the user's email is not found in db
      if (!userMin) {
        res.status(404).json({
          message: 'Unverified user with that email not found.'
        });
        return;
      }

      const codeMatch = await VerificationService.verificationCheck({
        phonenumber: phone_number,
        code
      });

      if (codeMatch === 'approved') {
        // check that the passwords match
        if (user && bcrypt.compareSync(password, userMin.password)) {
          // create hash of password to store in db
          const hash = bcrypt.hashSync(user.password, 12);

          const userNoCount = {
            full_name,
            email,
            phone_number
          };

          // rewrite the password on the new user object with the hash
          userNoCount.password = hash;

          // add user to DB
          await Users.add(userNoCount);

          // get user object (password omitted)
          const addedUser = await Users.findBy({
            email
          });

          // delete user from unverified table
          await UnverifiedUsers.remove({ id: userMin.id });

          // respond with added user object
          res.status(201).json(addedUser);
        } else {
          res.status(401).json({
            message: 'Invalid credentials.'
          });
        }
      } else {
        res.status(401).json({
          message: 'Invalid code'
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An unknown error occured.'
    });
  }
});

// logs in a user
router.post('/login', async (req, res) => {
  // user info passed in request body
  const { email, password } = req.body;

  // incorrect usage
  if (!email || !password) {
    res.status(422).json({
      message: 'Must provide email and password.'
    });
    return;
  }

  try {
    // checks that the user exists, gets the id and password from DB
    const user = await Users.findByMin({
      email
    });

    // if the user's email is not found in db
    if (!user) {
      res.status(404).json({ message: 'User with that email not found.' });
      return;
    }

    // check that the passwords match
    if (user && bcrypt.compareSync(password, user.password)) {
      // generate a token unique to that user
      const token = AuthService.generateToken(user);

      // respond with the token and the user id
      res.status(200).json({
        token,
        id: user.id
      });
    } else {
      res.status(401).json({
        message: 'Invalid credentials.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An unknown error occured. User could not be logged in.'
    });
  }
});

module.exports = router;
