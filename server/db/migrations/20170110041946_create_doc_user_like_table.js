
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('user_likes', t => {
      // t.bigIncrements('id');
      t.string('id', 11).notNullable().unique();
      t.integer('like_or_dislike').notNullable();
      t.string('user_id', 11).notNullable().references('users.id');
      t.string('foreign_id', 11).notNullable();
      t.string('foreign_table', 35).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user_likes')
  ]);
};
