
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('resumes', t => {
      // t.bigIncrements('id');
      t.string('id', 11).notNullable().unique();
      t.string('title', 60).notNullable();
      t.string('intent', 250).notNullable();
      t.string('file_name', 35).notNullable();
      t.string('audience_filter_id', 11).notNullable();
      t.string('audience_filter_table').notNullable();
      t.string('owner_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('review_requested_at');
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('resumes')
  ]);
};
