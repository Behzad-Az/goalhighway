
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('resume_review_feed', t => {
      t.increments('id');
      t.string('commenter_name', 30).notNullable();
      t.string('title', 50).notNullable();
      t.string('additional_info', 400).notNullable();
      t.integer('audience_filter_id').notNullable();
      t.string('audience_filter_table').notNullable();
      t.integer('commenter_id').notNullable().references('users.id');
      t.integer('resume_id').notNullable().references('resumes.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('resume_review_feed')
  ]);
};
