
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('course_feed', t => {
      t.bigIncrements('id');
      t.string('commenter_id', 11).notNullable().references('users.id');
      t.boolean('anonymous').notNullable();
      t.string('category', 35).notNullable();
      t.string('header', 60).notNullable();
      t.string('content', 535).notNullable();
      t.integer('course_id').notNullable().references('courses.id');
      t.string('doc_id').references('docs.id');
      t.string('rev_id').references('revisions.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('course_feed')
  ]);
};
