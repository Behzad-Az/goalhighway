
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('tutor_log', t => {
      t.string('id', 11).notNullable().unique();
      t.integer('rating');
      t.string('feedback', 500);
      t.string('issue_desc', 500).notNullable();
      t.string('course_id', 11).notNullable().references('courses.id');
      t.string('tutor_id', 11).references('users.id');
      t.string('student_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('closed_at');
      t.string('closure_reason', 35);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tutor_log')
  ]);
};
