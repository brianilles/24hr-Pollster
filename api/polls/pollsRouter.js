const router = require('express').Router();
const Users = require('../users/usersModel.js');
const Polls = require('./pollsModel.js');
const Options = require('./options/optionsModel.js');

// Creates a poll
router.post('/:id', async (req, res) => {
  // check the authorization of the post creator
  const { id } = req.params;
  let { question } = req.body;
  let { options } = req.body;

  const authorized = withRole(id, req, res);
  if (authorized) {
    // add the id onto poll
    poll = {
      user_id: id,
      question
    };

    // create the post
    try {
      // add to polls table
      const added = await Polls.add(poll);
      const addedId = added[0];
      let addedPost = await Polls.findBy({ id: addedId });

      // add to options table
      for (i in options) {
        await Options.add({ poll_id: addedId, text: options[i] });
      }
      const addedOptions = await Options.findByPollId(addedId);

      addedPost.options = addedOptions;
      res.status(201).json(addedPost);
    } catch (error) {
      res.status(500).json({
        message: 'An unknown error occured. Post could not be added.'
      });
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

// Gets a poll
// router.get('/:id', (req, res) => {});

// Deletes a poll
// router.delete('/:id', (req, res) => {});

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
module.exports = router;
