
exports.up = function(knex) {
  return knex.schema.createTable('users', col =>{
    col
    .increments();
    col
    .string('username',50)
    .notNullable()
    .unique();
    col
    .string('password', 50)
    .notNullable()
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
  
};
