exports.up = function(knex) {
  return knex.schema.createTable('unverified_users', unverified_users => {
    unverified_users.increments();
    unverified_users.string('full_name', 128).notNullable();
    unverified_users
      .string('email', 128)
      .notNullable()
      .unique();
    unverified_users
      .string('phone_number', 128)
      .notNullable()
      .unique();
    unverified_users.string('password', 128).notNullable();
    unverified_users
      .timestamp('created_at', {
        useTz: false
      })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('unverified_users');
};
