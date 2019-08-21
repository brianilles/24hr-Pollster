const router = require('express').Router();
const moment = require('moment');

// model imports
const Polls = require('./pollsModel.js');
const Votes = require('./votesModel.js');
const Options = require('./options/optionsModel.js');

// service imports
const AuthService = require('../users/auth/authServices.js');

// creates a poll
router.post('/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;
  let { text } = req.body;
  let { options } = req.body;

  try {
    // check that options length is less than or equal to 10
    if (options.length < 2 || options.length > 10) {
      res
        .status(400)
        .json({ message: 'Poll option count must be between 2 and 10' });
      return;
    }

    // check if jwt roles match
    const authorized = await AuthService.withRole(id, req, res);

    // if authorized, meaning role on the JWT
    if (authorized) {
      // add the id onto poll
      let poll = {
        user_id: id,
        text
      };
      // add to polls table
      const added = await Polls.add(poll);
      const addedId = added[0];

      // get added poll with id
      let addedPoll = await Polls.findBy({
        id: addedId
      });

      // add to options table
      for (i in options) {
        await Options.add({
          poll_id: addedId,
          text: options[i]
        });
      }

      // get all options added to db
      const addedOptions = await Options.findByPollId(addedId);

      // add the options onto the addedPoll
      addedPoll.options = addedOptions;

      // return Poll object with options
      res.status(201).json(addedPoll);
    } else {
      res.status(403).json({
        message: 'No Access. Invalid token.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An unknown error occured.'
    });
  }
});

// gets a poll
router.get('/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;

  try {
    // gets poll from db
    let poll = await Polls.findBy({
      id
    });

    // if poll exists in db
    if (poll) {
      // get the options in the db for that post
      const options = await Options.findByPollId(id);

      // add the options to the poll object
      poll.options = options;

      // respond with poll object
      res.status(201).json(poll);
    } else {
      res.status(404).json({
        message: 'That poll does not exist.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred getting the user.'
    });
  }
});

// deletes a poll
router.delete('/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;
  const { pollId } = req.body;

  // check if jwt roles match
  const authorized = await AuthService.withRole(id, req, res);

  // check if the poll is owned by the user
  const ownership = await AuthService.withPollOwnership(pollId, id, req, res);

  // if authorized, meaning role on the JWT
  if (authorized && ownership) {
    //remove tha poll from the db
    const poll = await Polls.remove({
      id: pollId
    });

    // remove the options related to the poll from the db
    const options = await Options.remove({
      poll_id: pollId
    });

    // TODO: remove the proposed polls vote and polls votes

    // if successfull deletion of poll return no content
    if (poll) {
      res.status(204).end();
    } else {
      res.status(500).json({
        message: 'An error occured. The poll was likely recently deleted.'
      });
    }
  } else {
    res.status(403).json({
      message: 'No Access. Invalid token.'
    });
  }
});

// adds an upvote to a pre poll
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

// has a day gone by since this poll was created?
function isActiveDay(created_at) {
  let created = moment(created_at);
  let now = moment().utc();
  console.log(created);
  console.log(now);

  // 86400 seconds in a day
  let dayInSeconds = 400;
  let secondsAgo = created.diff(now, 'seconds');
  console.log(secondsAgo);
  if (dayInSeconds + secondsAgo >= 0) {
    return true;
  } else {
    return false;
  }
}

// adds an downvote to a pre poll
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
        const active = isActiveDay(poll.created_at);
        if (!active) {
          await Polls.update(pollId);
          res.status(400).json({ message: 'Pre polling is no longer active.' });
        } else {
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
        }
      } else {
        res.status(404).json({ message: 'Poll not found.' });
      }
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

// has a day gone by since this poll was created?
function isActiveHour(created_at) {
  let created = moment(created_at);
  let now = moment();

  // 3600 seconds in an hour
  let hourInSeconds = 10;
  let secondsAgo = created.diff(now, 'seconds');
  console.log(secondsAgo);
  if (hourInSeconds - secondsAgo >= 0) {
    return true;
  } else {
    return false;
  }
}

// adds a vote to a poll
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
      const poll = await Polls.findBy({ id: pollId });
      const active = isActiveHour(poll.created_at);
      console.log(active);
      if (!active) {
        await Polls.updatePolling(pollId);
        res.status(400).json({ message: 'Polling is no longer active.' });
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
    }
  } else {
    res.status(403).json({ message: 'No Access. Invalid token.' });
  }
});

module.exports = router;
