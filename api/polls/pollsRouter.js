const router = require('express').Router();
const Users = require('../users/usersModel.js');
const Polls = require('./pollsModel.js');
const Votes = require('./votesModel.js');
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
      let addedPoll = await Polls.findBy({ id: addedId });

      // add to options table
      for (i in options) {
        await Options.add({ poll_id: addedId, text: options[i] });
      }
      const addedOptions = await Options.findByPollId(addedId);

      addedPoll.options = addedOptions;
      res.status(201).json(addedPoll);
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
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let poll = await Polls.findBy({ id });
    if (poll) {
      const options = await Options.findByPollId(id);
      poll.options = options;
      res.status(201).json(poll);
    } else {
      res.status(404).json({ message: 'That poll does not exist.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred getting the user.' });
  }
});

// Deletes a poll
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { pollId } = req.body;

  const authorized = withRole(id, req, res);
  if (authorized) {
    const poll = await Polls.remove({ id: pollId });
    const options = await Options.remove({ poll_id: pollId });
    if (poll) {
      res.status(204).end();
    } else {
      res.status(500).json({
        message: 'An error occured. The poll was likely recently deleted.'
      });
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

// delete votes on poll

//TODO - check for prepolling_active
// Adds an upvote to a pre poll
router.post('/prevote/upvote/:id', async (req, res) => {
  const { id } = req.params;
  const { pollId } = req.body;

  const authorized = withRole(id, req, res);
  if (authorized) {
    const hasVoted = await Votes.findBy({
      user_id: id,
      poll_id: pollId
    });
    if (hasVoted) {
      res
        .status(405)
        .json({ message: 'User has already voted for this pre poll.' });
    } else {
      const poll = await Polls.findBy({ id: pollId });
      if (poll) {
        let poll_up = poll.up_votes + 1;
        const updatedPoll = await Polls.updateUp({
          id: pollId,
          up_votes: poll_up
        });
        await Votes.add({
          user_id: id,
          poll_id: pollId
        });
        res.status(200).json(updatedPoll);
      } else {
        res.status(404).json({ message: 'Poll not found.' });
      }
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

// Adds an downvote to a pre poll
router.post('/prevote/downvote/:id', async (req, res) => {
  const { id } = req.params;
  const { pollId } = req.body;

  const authorized = withRole(id, req, res);
  if (authorized) {
    const hasVoted = await Votes.findBy({
      user_id: id,
      poll_id: pollId
    });
    if (hasVoted) {
      res
        .status(405)
        .json({ message: 'User has already voted for this pre poll.' });
    } else {
      const poll = await Polls.findBy({ id: pollId });
      if (poll) {
        let poll_down = poll.down_votes + 1;
        const updatedPoll = await Polls.updateDown({
          id: pollId,
          down_votes: poll_down
        });
        await Votes.add({
          user_id: id,
          poll_id: pollId
        });
        res.status(200).json(updatedPoll);
      } else {
        res.status(404).json({ message: 'Poll not found.' });
      }
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

// Adds a vote to a poll

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
