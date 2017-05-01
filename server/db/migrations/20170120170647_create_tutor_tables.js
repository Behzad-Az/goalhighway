
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('tutor_log', t => {
      t.increments('id');
      t.integer('rating');
      t.string('feedback', 500);
      t.string('issue_desc', 500).notNullable();
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('tutor_id').references('users.id');
      t.integer('student_id').notNullable().references('users.id');
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
