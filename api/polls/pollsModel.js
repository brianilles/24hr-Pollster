const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  remove,
  updateUp,
  updateDown,
  update,
  updatePollPassed,
  updatePollFailed,
  findByPollId,
  updatePollComplete
};

// finds poll without user id
function findBy(filter) {
  return db('polls')
    .select(
      'id',
      'text',
      'up_votes',
      'down_votes',
      'proposed_polling_status',
      'polling_status ',
      'poll_status ',
      'created_at'
    )
    .where(filter)
    .first();
}

// adds poll to db
function add(poll) {
  return db('polls').insert(poll);
}

// removes poll from db
function remove(filter) {
  return db('polls')
    .where(filter)
    .del();
}

function updateUp(pollData) {
  return db('polls')
    .where({ id: pollData.id })
    .update({ up_votes: pollData.up_votes });
}

function updateDown(pollData) {
  return db('polls')
    .where({ id: pollData.id })
    .update({ down_votes: pollData.down_votes });
}

function update(id) {
  return db('polls')
    .where({ id })
    .update({ prepolling_active: false });
}

// the proposed poll has passed
function updatePollPassed(id) {
  return db('polls')
    .where({ id })
    .update({
      proposed_polling_status: 'complete',
      polling_status: 'active',
      poll_status: 'success'
    });
}

function updatePollFailed(id) {
  return db('polls')
    .where({ id })
    .update({
      proposed_polling_status: 'complete',
      polling_status: 'complete',
      poll_status: 'failed'
    });
}

// returns the creator of the poll
function findByPollId(pollId) {
  return db('polls')
    .select('user_id')
    .where({ id: pollId })
    .first();
}

function updatePollComplete(id) {
  return db('polls')
    .where({ id })
    .update({ polling_status: 'complete', poll_status: 'complete' });
}
