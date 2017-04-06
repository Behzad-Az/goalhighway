
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('tutor_log', t => {
      t.increments('id');
      t.integer('rating');
      t.string('feedback', 400);
      t.string('issue_desc', 400).notNullable();
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('tutor_id').references('users.id');
      t.integer('student_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('closed_at');
      t.string('closure_reason', 50);
    }),

    knex.schema.table('course_user', t => {
      t.boolean('tutor_status').notNullable().defaultTo(false);
      t.boolean('tutor_available').notNullable().defaultTo(false);
      t.timestamp('sub_date').defaultTo(knex.fn.now());
      t.timestamp('unsub_date');
      t.string('unsub_reason');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tutor_log'),
    knex.schema.table('course_user', t => {
      t.dropColumn('tutor_status'),
      t.dropColumn('tutor_available'),
      t.dropColumn('sub_date'),
      t.dropColumn('unsub_date'),
      t.dropColumn('unsub_reason')
    })
  ]);
};
