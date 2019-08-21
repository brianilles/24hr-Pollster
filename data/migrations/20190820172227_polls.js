exports.up = function(knex) {
  return knex.schema.createTable('polls', polls => {
    polls.increments();
    polls
      .integer('user_id')
      .unsigned()
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    polls.string('text').notNullable();
    polls.integer('up_votes').defaultTo(0);
    polls.integer('down_votes').defaultTo(0);
    polls.string('proposed_polling_status').defaultTo('active');
    polls.string('polling_status').defaultTo('inactive');
    polls.string('poll_status').defaultTo('inactive');
    polls
      .timestamp('created_at', {
        useTz: false
      })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('polls');
};
