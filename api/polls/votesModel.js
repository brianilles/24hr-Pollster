const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  pollFindBy,
  addVotes
};

function findBy(filter) {
  return db('users_proposed_polls_votes')
    .select()
    .where(filter)
    .first();
}

function add(ids) {
  return db('users_proposed_polls_votes').insert(ids);
}

function pollFindBy(filter) {
  return db('users_polls_votes')
    .select()
    .where(filter)
    .first();
}

function addVotes(ids) {
  return db('users_polls_votes').insert(ids);
}
