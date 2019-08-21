const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  remove,
  updateUp,
  updateDown,
  update,
  updatePolling
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
function updatePolling(id) {
  return db('polls')
    .where({ id })
    .update({ polling_active: false, completed: false });
}
