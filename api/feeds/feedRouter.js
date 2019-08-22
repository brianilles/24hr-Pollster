const router = require('express').Router();

// service imports
const AuthService = require('../users/auth/authServices.js');
const FeedService = require('./feedServices.js');

// gets a feed of proposed polls
router.get('/proposedpolls/:id/:chunk', async (req, res) => {
  // gets id and request chunk from request params
  const { id, chunk } = req.params;
  const reqData = { id, chunk };
  try {
    // check that the token-id combination is authorized
    const authorized = await AuthService.withRole(id, req, res);
    // if authorized, get the feed
    if (authorized) {
      // get a the feed from the feedService
      const proposedPolls = await FeedService.proposedPollsFeed(reqData);
      // If feed creation successful
      if (proposedPolls) {
        res.status(200).json(proposedPolls);
      } else {
        res.status(500).json({
          message: 'No proposed polls found.'
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
router.get('/activepolls/:id/:chunk', async (req, res) => {
  // gets id and request chunk from request params
  const { id, chunk } = req.params;
  const reqData = { id, chunk };
  try {
    // check that the token-id combination is authorized
    const authorized = await AuthService.withRole(id, req, res);
    // if authorized, get the feed
    if (authorized) {
      // get a the feed from the feedService
      const activePolls = await FeedService.activePollsFeed(reqData);
      // If feed creation successful
      if (activePolls) {
        res.status(200).json(activePolls);
      } else {
        res.status(500).json({
          message: 'No active polls found.'
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

// gets a feed of completed successfull polls
router.get('/completedpolls/:id/:chunk', async (req, res) => {
  // gets id and request chunk from request params
  const { id, chunk } = req.params;
  const reqData = { id, chunk };
  try {
    // check that the token-id combination is authorized
    const authorized = await AuthService.withRole(id, req, res);
    // if authorized, get the feed
    if (authorized) {
      // get a the feed from the feedService
      const completedPolls = await FeedService.completedPollsFeed(reqData);
      // If feed creation successful
      if (completedPolls) {
        res.status(200).json(completedPolls);
      } else {
        res.status(500).json({
          message: 'No completed polls found.'
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

module.exports = router;
