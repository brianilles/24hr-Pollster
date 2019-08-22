// models imports
const Polls = require('../polls/pollsModel.js');
const Options = require('../polls/options/optionsModel.js');
const PollsVotesOptions = require('./pollsVotesOptionsModel.js');

// services imports
const VotesService = require('../polls/votesServices.js');

module.exports = {
  proposedPollsFeed,
  activePollsFeed,
  completedPollsFeed
};

function toNum(reqData) {
  // convert to numbers
  reqData.id = Number(reqData.id);
  reqData.chunk = Number(reqData.chunk);
  return reqData;
}

// creates a feed of proposed polls
async function proposedPollsFeed(reqData) {
  const reqDataNum = toNum(reqData);

  // get all the unupdated active proposed polls
  const unUpdatedPolls = await Polls.findByAll({
    proposed_polling_status: 'active'
  });

  // update them
  for (let poll of unUpdatedPolls) {
    await VotesService.getPollStatus(poll);
  }

  // get all active polls
  const activeProposedPolls = await Polls.findByAllChunk({
    proposed_polling_status: 'active'
  });

  // get all the options in the active polls
  for (let poll of activeProposedPolls) {
    const options = await Options.findByPollId(poll.id);
    poll.options = options;
  }

  // return all active updated polls
  return activeProposedPolls;
}

// creates a feed of active polls
async function activePollsFeed(reqData) {
  const reqDataNum = toNum(reqData);

  // get all the unupdated active proposed polls
  const unUpdatedPolls = await Polls.findByAll({
    polling_status: 'active'
  });

  // update them
  for (let poll of unUpdatedPolls) {
    await VotesService.getPollStatus(poll);
  }

  // get all active polls
  const activePolls = await Polls.findByAllChunk({
    polling_status: 'active'
  });

  // get all the options in the active polls
  for (let poll of activePolls) {
    const options = await Options.findByPollId(poll.id);
    poll.options = options;
  }

  // return all active updated polls
  return activePolls;
}

// creates a feed of completed successful polls
async function completedPollsFeed(reqData) {
  const reqDataNum = toNum(reqData);

  // get all the unupdated active proposed polls
  const unUpdatedPolls = await Polls.findByAll({
    poll_status: 'success',
    polling_status: 'complete'
  });

  // update them
  for (let poll of unUpdatedPolls) {
    await VotesService.getPollStatus(poll);
  }

  // get all active polls
  const completedPolls = await Polls.findByAllChunk({
    poll_status: 'success',
    polling_status: 'complete'
  });

  // get all the options in the active polls
  for (let poll of completedPolls) {
    const options = await Options.findByPollId(poll.id);
    poll.options = options;
  }

  // return all active updated polls
  return completedPolls;
}
