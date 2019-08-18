const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy
};

function add(user) {
  return db('users').insert(user);
}

function findBy(filter) {
  return db('users')
    .select(
      'id',
      'full_name',
      'email',
      'phone_number',
      'verified',
      'score',
      'created_at'
    )
    .where(filter)
    .first();
}