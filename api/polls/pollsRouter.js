const moment = require('moment');
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

    // create the poll
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
        // check for poll duration
        const active = isActiveDay(poll.created_at);
        if (!active) {
          await Polls.update(pollId);
          res.status(400).json({ message: 'Pre polling is no longer active.' });
        } else {
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
        }
      } else {
        res.status(404).json({ message: 'Poll not found.' });
      }
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

function isActiveDay(created_at) {
  let created = moment(created_at);
  let now = moment();

  // 86400 seconds in a day
  let dayInSeconds = 86400;
  let secondsAgo = created.diff(now, 'seconds');
  if (dayInSeconds - secondsAgo >= 0) {
    return true;
  } else {
    return false;
  }
}

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
router.post('/vote/:id', async (req, res) => {
  const { id } = req.params;
  const { pollId, optionId } = req.body;

  // 1. check that the poll exists
  // 2. increment the value of the optionId

  const authorized = withRole(id, req, res);
  if (authorized) {
    const hasVotedForPoll = await Votes.pollFindBy({
      user_id: id,
      poll_id: pollId
    });
    if (hasVotedForPoll) {
      res
        .status(405)
        .json({ message: 'User has already voted for this poll.' });
    } else {
      const option = await Options.findBy({ id: optionId });

      // check that the option exists on the poll
      if (option && option.poll_id === pollId) {
        // add votes to option
        const upOption = option.votes + 1;
        const updatedOption = await Options.updateUp({
          id: optionId,
          votes: upOption
        });
        if (updatedOption) {
          await Votes.addVotes({
            user_id: id,
            poll_id: pollId
          });
          res.status(200).json(updatedOption);
        } else {
          res.status(404).json({ message: 'Option not found.' });
        }
      } else {
        res.status(404).json({ message: 'Poll/Option not found.' });
      }
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
module.exports = router;
