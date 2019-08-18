exports.up = function(knex) {
  return knex.schema.createTable('userPrePollVotes', userPrePollVotes => {
    userPrePollVotes.increments();
    userPrePollVotes
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    userPrePollVotes
      .integer('poll_id')
      .unsigned()
      .notNullable()
      .references('polls.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('userPrePollVotes');
};
