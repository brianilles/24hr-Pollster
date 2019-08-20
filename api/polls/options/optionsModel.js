const db = require('../../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findByPollId,
  remove,
  updateUp
};

function findBy(filter) {
  return db('options')
    .select()
    .where(filter)
    .first();
}

function findByPollId(poll_id) {
  return db('options')
    .select('id', 'poll_id', 'text', 'votes')
    .where('poll_id', poll_id);
}

function add(option) {
  return db('options').insert(option);
}

function remove(filter) {
  return db('options')
    .where(filter)
    .del();
}

function updateUp(pollData) {
  return db('options')
    .where({ id: pollData.id })
    .update({ votes: pollData.votes });
}
