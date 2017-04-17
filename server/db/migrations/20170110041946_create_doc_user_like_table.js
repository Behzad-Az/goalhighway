
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('doc_user_likes', t => {
      t.increments('id');
      t.integer('like_count').notNullable().defaultTo(0);
      t.integer('user_id').notNullable().references('users.id');
      t.integer('doc_id').notNullable().references('docs.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('doc_user_likes')
  ]);
};
