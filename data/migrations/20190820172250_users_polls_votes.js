exports.up = function(knex) {
  return knex.schema.createTable('users_polls_votes', users_polls_votes => {
    users_polls_votes.increments();
    users_polls_votes
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    users_polls_votes
      .integer('poll_id')
      .unsigned()
      .notNullable()
      .references('polls.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users_polls_votes');
};
