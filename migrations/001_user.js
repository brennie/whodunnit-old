exports.up = knex => 
  knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('email').unique();
    table.binary('salt', 8);
    table.string('passHash', 64);
    table.string('name');
  })

exports.down = knex =>
  knex.schema.dropTable('users');
