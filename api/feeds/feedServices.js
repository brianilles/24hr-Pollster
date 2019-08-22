// models imports
const Polls = require('../polls/pollsModel.js');
const Options = require('../polls/options/optionsModel.js');
const PollsVotesOptions = require('./pollsVotesOptionsModel.js');

// services imports
const VotesService = require('../polls/votesServices.js');

module.exports = {
  proposedPollsFeed
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

// // creates a feed of completed polls
// async function userFeed(reqData) {
//   const reqDataNum = toNum(reqData);

//   // get the join of polls and count of votes
//   const pollsVotedChunk = PollsOptionsVotes.getPollsVoted(reqData);

//   // sort that by
//   return pollsVotedChunk;
// }

// creates a feed of active polls
function activePollsFeed(reqData) {
  const reqDataNum = toNum(reqData);
  return reqDataNum;
}
