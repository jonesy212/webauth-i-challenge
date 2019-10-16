
exports.up = function(knex) {
  return knex.schema.createTable('users', col =>{
    col
    .increments();
    col
    .string('username',128)
    .notNullable()
    .unique();
    col
    .string('password', 128)
    .notNullable()
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users')
};
