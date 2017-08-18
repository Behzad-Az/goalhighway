
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('login_history', t => {
      t.bigIncrements('id');
      t.string('user_id', 11).notNullable().references('users.id');
      t.string('ip_address', 30).notNullable().defaultTo('unknown_ip');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('login_history')
  ]);
};
