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

function findBy(filter) {
  return db('polls')
    .select(
      'id',
      'question',
      'up_votes',
      'down_votes',
      'polling_active',
      'prepolling_active',
      'completed',
      'created_at'
    )
    .where(filter)
    .first();
}

function add(poll) {
  return db('polls').insert(poll);
}

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
