
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('emails', t => {
      t.increments('id');
      t.string('title', 100).notNullable();
      t.string('content', 1000).notNullable();
      t.integer('from_id').notNullable().references('users.id');
      t.integer('to_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('emails')
  ]);
};
