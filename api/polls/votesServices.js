const moment = require('moment');

// models imports
const Polls = require('../polls/pollsModel.js');

module.exports = {
  getProposedPollStatus,
  getPollStatus
};

// check the status of the poll and update if necessary
async function getProposedPollStatus(poll) {
  // store the creation time and the current time
  let created = moment.parseZone(poll.created_at);
  let now = moment().utc();
  let difference = now.diff(created, 'seconds');

  try {
    // 3600 seconds in an hour
    if (difference >= 3600) {
      // check to see if the up votes are greater than or equal to downvotes
      if (poll.up_votes > poll.down_votes) {
        await Polls.updatePollPassed(poll.id);
      } else {
        await Polls.updatePollFailed(poll.id);
      }
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

// check the status of the poll and update if necessary
async function getPollStatus(poll) {
  // store the creation time and the current time
  let created = moment.parseZone(poll.created_at);
  let now = moment().utc();
  let difference = now.diff(created, 'seconds');

  try {
    // 3600 seconds in an hour
    await getProposedPollStatus(poll);
    if (difference >= 7200) {
      // check to see if the up votes are greater than or equal to downvotes
      await Polls.updatePollComplete(poll.id);
      return false;
    } else if (poll.polling_status === 'active') {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
