
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('flags', t => {
      // t.bigIncrements('id');
      t.string('id', 11).notNullable().unique();
      t.string('reason', 35).notNullable();
      t.string('foreign_id', 11).notNullable();
      t.string('foreign_table', 35).notNullable();
      t.string('flagger_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('flags')
  ]);
};
