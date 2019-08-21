const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findByMin,
  remove
};

function add(user) {
  return db('users').insert(user);
}

// finds and returns a user's info, (password omitted)
function findBy(filter) {
  return db('users')
    .select(
      'id',
      'full_name',
      'email',
      'phone_number',
      'verified_status',
      'score',
      'created_at'
    )
    .where(filter)
    .first();
}

// finds and returns user id and password
function findByMin(filter) {
  return db('users')
    .select('id', 'password')
    .where(filter)
    .first();
}

// remove user from db
function remove(filter) {
  return db('users')
    .where(filter)
    .del();
}
