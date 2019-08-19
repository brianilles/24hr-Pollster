const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findByWithPass,
  remove
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

function findByWithPass(filter) {
  return db('users')
    .select('id', 'password')
    .where(filter)
    .first();
}

function remove(filter) {
  return db('users')
    .where(filter)
    .del();
}
