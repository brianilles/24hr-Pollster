exports.up = function(knex) {
  return knex.schema.createTable('users_unverified', users_unverified => {
    users_unverified.increments();
    users_unverified
      .string('phone_number', 128)
      .notNullable()
      .unique();
    users_unverified.integer('attempt_count').defaultTo(0);
    users_unverified
      .timestamp('created_at', {
        useTz: false
      })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users_unverified');
};
