exports.up = function(knex) {
  return knex.schema.createTable('polls', polls => {
    polls.increments();
    polls
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    polls.string('question', 128).notNullable();
    polls.integer('up_votes').defaultTo(0);
    polls.integer('down_votes').defaultTo(0);
    polls.boolean('polling_active').defaultTo(false);
    polls.boolean('prepolling_active').defaultTo(true);
    polls.boolean('completed').defaultTo(false);
    polls.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('polls');
};
