
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('notifications', t => {
      t.increments('id');
      t.string('category', 50).notNullable();
      t.string('content', 400).notNullable();
      t.boolean('unviewed').notNullable().defaultTo(true);
      t.integer('to_id').notNullable().references('users.id');
      t.integer('from_id').references('users.id');
      t.integer('course_id').references('courses.id');
      t.integer('doc_id').references('docs.id');
      t.integer('tutor_log_id').references('tutor_log.id');
      t.timestamp('notif_created_at').notNullable().defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('notifications')
  ]);
};
