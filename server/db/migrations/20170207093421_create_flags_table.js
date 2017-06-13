
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('flags', t => {
      t.bigIncrements('id');
      t.string('reason', 35).notNullable();
      t.integer('foreign_id').notNullable();
      t.string('foreign_table', 35).notNullable();
      t.integer('flagger_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('flags')
  ]);
};
