const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  pollFindBy,
  addVotes
};

function findBy(filter) {
  return db('userPrePollVotes')
    .select()
    .where(filter)
    .first();
}

function add(ids) {
  return db('userPrePollVotes').insert(ids);
}

function pollFindBy(filter) {
  return db('userPollVotes')
    .select()
    .where(filter)
    .first();
}

function addVotes(ids) {
  return db('userPollVotes').insert(ids);
}
