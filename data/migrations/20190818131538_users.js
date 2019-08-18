exports.up = function(knex) {
  return knex.schema.createTable('users', users => {
    users.increments();
    users.string('full_name', 128).notNullable();
    users
      .string('email', 128)
      .notNullable()
      .unique();
    users
      .string('phone_number', 128)
      .notNullable()
      .unique();
    users.string('password', 128).notNullable();
    users
      .boolean('verified')
      .defaultTo(false)
      .notNullable();
    users.decimal('score', 3, 2);
    users.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
