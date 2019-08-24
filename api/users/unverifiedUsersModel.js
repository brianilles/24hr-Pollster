const db = require('../../data/dbConfig.js');

module.exports = {
  add,
  findBy,
  findByMin,
  remove
};

function add(user) {
  return db('unverified_users').insert(user);
}

// finds and returns a user's info, (password omitted)
function findBy(filter) {
  return db('unverified_users')
    .select('id', 'full_name', 'email', 'phone_number', 'created_at')
    .where(filter)
    .first();
}

// finds and returns user id and password
function findByMin(filter) {
  return db('unverified_users')
    .select('id', 'password')
    .where(filter)
    .first();
}

// remove user from db
function remove(filter) {
  return db('unverified_users')
    .where(filter)
    .del();
}
