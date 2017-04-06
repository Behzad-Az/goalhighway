
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('course_feed', t => {
      t.increments('id');
      t.integer('commenter_id').notNullable().references('users.id');
      t.string('commenter_name', 30).notNullable().defaultTo('anonymous');
      t.string('category', 100).notNullable();
      t.string('content', 400).notNullable();
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('doc_id').references('docs.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('course_feed')
  ]);
};
