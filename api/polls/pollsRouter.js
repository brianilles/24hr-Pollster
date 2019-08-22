const router = require('express').Router();
const moment = require('moment');

// model imports
const Polls = require('./pollsModel.js');
const Votes = require('./votesModel.js');
const Options = require('./options/optionsModel.js');

// service imports
const AuthService = require('../users/auth/authServices.js');
const VotesService = require('./votesServices.js');

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
    let pollBefore = await Polls.findBy({
      id
    });

    // if poll exists in db
    if (pollBefore) {
      // time check

      await VotesService.getPollStatus(pollBefore);

      let poll = await Polls.findBy({
        id
      });
      // get the options in the db for that post
      const options = await Options.findByPollId(id);

      // add the options to the poll object
      poll.options = options;

      // respond with poll object
      res.status(200).json(poll);
    } else {
      res.status(404).json({
        message: 'That poll does not exist.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred getting the poll.'
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
router.post('/proposedvote/upvote/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;
  const { pollId } = req.body;

  try {
    // check if jwt roles match
    const authorized = await AuthService.withRole(id, req, res);

    if (authorized) {
      // get the poll
      const poll = await Polls.findBy({
        id: pollId
      });

      if (poll) {
        // check that this proposed poll is still active
        const proposedPollStatus = await VotesService.getProposedPollStatus(
          poll
        );

        // if true meaning the poll is still active (hasn't been an hour yet)
        if (proposedPollStatus) {
          // check if the user has voted for this poll yet, no double votes allowed
          const hasVoted = await Votes.findBy({
            user_id: id,
            poll_id: pollId
          });

          // if user has already voted
          if (hasVoted) {
            res.status(405).json({
              message: 'User has already voted for this pre poll.'
            });
          } else {
            // update the up_votes by + 1
            let poll_up = poll.up_votes + 1;
            const updatedPoll = await Polls.updateUp({
              id: pollId,
              up_votes: poll_up
            });

            // record the user has voted for this poll
            await Votes.add({
              user_id: id,
              poll_id: pollId
            });

            // respond with the updated poll
            res.status(200).json(updatedPoll);
          }
        } else {
          res.status(400).json({
            message: 'Polling has ended.'
          });
        }
      } else {
        res.status(404).json({
          message: 'Poll not found.'
        });
      }
    } else {
      res.status(403).json({ message: 'No Access. Invalid token.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An unknown error occured.' });
  }
});

// adds an downvote to a pre poll
router.post('/proposedvote/downvote/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;
  const { pollId } = req.body;

  try {
    // check if jwt roles match
    const authorized = await AuthService.withRole(id, req, res);

    if (authorized) {
      // get the poll
      const poll = await Polls.findBy({
        id: pollId
      });

      if (poll) {
        // check that this proposed poll is still active
        const proposedPollStatus = await VotesService.getProposedPollStatus(
          poll
        );

        // if true meaning the poll is still active (hasn't been an hour yet)
        if (proposedPollStatus) {
          // check if the user has voted for this poll yet, no double votes allowed
          const hasVoted = await Votes.findBy({
            user_id: id,
            poll_id: pollId
          });

          // if user has already voted
          if (hasVoted) {
            res.status(405).json({
              message: 'User has already voted for this pre poll.'
            });
          } else {
            // update the down_votes by + 1
            let poll_down = poll.down_votes + 1;
            const updatedPoll = await Polls.updateDown({
              id: pollId,
              down_votes: poll_down
            });

            // record the user has voted for this poll
            await Votes.add({
              user_id: id,
              poll_id: pollId
            });

            // respond with the updated poll
            res.status(200).json(updatedPoll);
          }
        } else {
          res.status(400).json({
            message: 'Polling has ended.'
          });
        }
      } else {
        res.status(404).json({
          message: 'Poll not found.'
        });
      }
    } else {
      res.status(403).json({ message: 'No Access. Invalid token.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An unknown error occured.' });
  }
});

// adds a vote to a poll
router.post('/vote/:id', async (req, res) => {
  // gets id from request params
  const { id } = req.params;
  const { pollId, optionId } = req.body;

  try {
    // check if jwt roles match
    const authorized = await AuthService.withRole(id, req, res);

    if (authorized) {
      // get the poll
      const poll = await Polls.findBy({
        id: pollId
      });

      if (poll) {
        // check that this poll is still active
        const pollStatus = await VotesService.getPollStatus(poll);

        // if true meaning the poll is still active
        if (pollStatus) {
          // check if the user has voted for this poll yet, no double votes allowed
          const hasVoted = await Votes.pollFindBy({
            user_id: id,
            poll_id: pollId
          });

          // if user has already voted
          if (hasVoted) {
            res.status(405).json({
              message: 'User has already voted for this poll.'
            });
          } else {
            // get the option
            const option = await Options.findBy({
              id: optionId
            });

            // check that the option exists on the poll
            if (option && option.poll_id === pollId) {
              // add vote to option
              const upOption = option.votes + 1;

              // get the updated option
              const updatedOption = await Options.updateUp({
                id: optionId,
                votes: upOption
              });

              // if successfull
              if (updatedOption) {
                await Votes.addVotes({
                  user_id: id,
                  poll_id: pollId
                });
                res.status(200).json(updatedOption);
              } else {
                res.status(404).json({
                  message: 'Option not found.'
                });
              }
            } else {
              res.status(404).json({
                message: 'Poll/Option not found.'
              });
            }
          }
        } else {
          const pollNow = await Polls.findBy({
            id: pollId
          });
          if (pollNow.polling_status === 'complete') {
            res.status(400).json({
              message: 'Polling has ended.'
            });
            return;
          } else {
            res.status(400).json({
              message: 'Poll has not been approved yet.'
            });
            return;
          }
        }
      } else {
        res.status(404).json({
          message: 'Poll not found.'
        });
      }
    } else {
      res.status(403).json({ message: 'No Access. Invalid token.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An unknown error occured.' });
  }
});

module.exports = router;
