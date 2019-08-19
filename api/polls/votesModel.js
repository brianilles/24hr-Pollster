const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy
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
