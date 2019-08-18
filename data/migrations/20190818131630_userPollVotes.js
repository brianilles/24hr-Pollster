exports.up = function(knex) {
  return knex.schema.createTable('userPollVotes', userPollVotes => {
    userPollVotes.increments();
    userPollVotes
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    userPollVotes
      .integer('poll_id')
      .unsigned()
      .notNullable()
      .references('polls.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('userPollVotes');
};
