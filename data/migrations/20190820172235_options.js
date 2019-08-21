exports.up = function(knex) {
  return knex.schema.createTable('options', options => {
    options.increments();
    options
      .integer('poll_id')
      .unsigned()
      .notNullable()
      .references('polls.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    options.string('text', 128).notNullable();
    options.integer('votes').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('options');
};
