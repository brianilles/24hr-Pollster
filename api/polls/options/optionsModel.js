const db = require('../../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findByPollId
};

function findBy(filter) {
  return db('options')
    .select()
    .where(filter)
    .first();
}

function findByPollId(poll_id) {
  return db('options')
    .select('text', 'votes')
    .where('poll_id', poll_id);
}

function add(option) {
  return db('options').insert(option);
}
