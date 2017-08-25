
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('download_log', t => {
      t.bigIncrements('id');
      t.string('user_id', 11).notNullable().references('users.id');
      t.string('file_id', 11).notNullable();
      t.string('file_type', 35).notNullable();
      t.timestamp('downloaded_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('download_log')
  ]);
};
