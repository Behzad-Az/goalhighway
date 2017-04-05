
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('resume_review_feed', t => {
      t.increments('id');
      t.integer('owner_id').notNullable().references('users.id');
      t.string('owner_name', 30).notNullable();
      t.string('content', 400).notNullable();
      t.integer('resume_id').notNullable().references('resumes.id');
      t.integer('audience_filter_id').notNullable();
      t.string('audience_filter_table').notNullable();
      t.timestamp('feed_created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('feed_deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('resume_review_feed')
  ]);
};
