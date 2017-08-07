
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('course_feed_replies', t => {
      t.string('id', 11).notNullable().unique();
      t.string('content', 500).notNullable();
      t.string('course_feed_id', 11).notNullable().references('course_feed.id');
      t.string('commenter_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('course_feed_replies')
  ]);
};
