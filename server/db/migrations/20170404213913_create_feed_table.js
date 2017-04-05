
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('feed', t => {
      t.increments('id');
      t.integer('commenter_id').notNullable().references('users.id');
      t.string('commenter_name', 30).notNullable();
      t.string('content', 400).notNullable();
      t.string('type', 25).notNullable();
      t.string('discussion_bool').notNullable().defaultTo(false);
      t.integer('ref_id').notNullable();
      t.string('ref_table').notNullable();
      t.integer('audience_filter_id').notNullable();
      t.string('audience_filter_table').notNullable();
      t.timestamp('feed_created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('feed_deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('feed')
  ]);
};
