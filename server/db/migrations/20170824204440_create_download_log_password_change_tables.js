
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('download_log', t => {
      t.bigIncrements('id');
      t.string('user_id', 11).notNullable().references('users.id');
      t.string('file_id', 11).notNullable();
      t.string('file_type', 35).notNullable();
      t.timestamp('downloaded_at').notNullable().defaultTo(knex.fn.now());
    }),

    knex.schema.createTableIfNotExists('password_change_requests', t => {
      t.string('id', 60).notNullable().unique();
      t.string('user_id', 11).notNullable().references('users.id');
      t.string('email', 30).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('download_log'),
    knex.schema.dropTable('password_change_requests')
  ]);
};
