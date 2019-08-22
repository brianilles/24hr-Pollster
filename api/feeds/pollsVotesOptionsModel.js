const db = require('../../data/dbConfig.js');

module.exports = { getPollsVoted };

function getPollsVoted(filter) {
  return db('polls')
    .select('poll_id')
    .where({ user_id: filter.id });
}
