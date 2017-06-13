
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('user_likes', t => {
      t.bigIncrements('id');
      t.integer('like_or_dislike').notNullable();
      t.integer('user_id').notNullable().references('users.id');
      t.integer('foreign_id').notNullable();
      t.string('foreign_table').notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user_likes')
  ]);
};
