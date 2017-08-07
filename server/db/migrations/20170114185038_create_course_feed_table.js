
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('course_feed', t => {
      t.string('id', 11).notNullable().unique();
      t.boolean('anonymous').notNullable();
      t.string('category', 35).notNullable();
      t.string('header', 60).notNullable();
      t.string('content', 535).notNullable();
      t.string('commenter_id', 11).notNullable().references('users.id');
      t.string('course_id', 11).notNullable().references('courses.id');
      t.string('doc_id', 11).references('docs.id');
      t.string('rev_id', 11).references('revisions.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('course_feed')
  ]);
};
