const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  remove
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
