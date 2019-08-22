const router = require('express').Router();

// service imports
const AuthService = require('../users/auth/authServices.js');
const FeedService = require('./feedServices.js');

// gets a feed of completed polls
router.get('/completedpolls/:id/:count', async (req, res) => {
  // gets id and request count from request params
  const { id, count } = req.params;
  const reqData = { id, count };

  try {
    // check that the token-id combination is authorized
    const authorized = await AuthService.withRole(id, req, res);

    // if authorized, get the feed
    if (authorized) {
      // get a the feed from the feedService
      const completedPollsFeed = await FeedService.completedPollsFeed(reqData);

      // If feed creation successful
      if (completedPollsFeed) {
        res.status(200).json(completedPollsFeed);
      } else {
        res.status(500).json({
          message: 'An unknown error occured while retrieving the feed.'
        });
      }
    } else {
      res.status(403).json({ message: 'No Access. Invalid token.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unknown error occured.' });
  }
});

// gets a feed of active polls
router.get('/activepolls/:id', (req, res) => {
  res.status(200).json({ message: 'test working' });
});

// gets a feed of proposed polls
router.get('/proposedpolls/:id', (req, res) => {
  res.status(200).json({ message: 'test working' });
});

module.exports = router;
