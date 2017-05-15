
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('users', t => {
      t.increments('id');
      t.string('username', 30).notNullable().unique();
      t.string('password', 60).notNullable();
      t.string('email', 30).notNullable().unique();
      t.integer('user_year').notNullable();
      t.boolean('validated').notNullable().defaultTo(false);
      t.string('postal_code', 10);
      t.float('lat', 8, 5);
      t.float('lon', 8, 5);
      t.string('job_query', 250);
      t.string('job_kind', 100);
      t.integer('job_distance');
      t.string('photo_name', 35).notNullable().defaultTo('default_user_photo.png');
      t.integer('inst_prog_id').notNullable().references('institution_program.id');
      t.timestamp('last_feed_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('revisions', t => {
      t.increments('id');
      t.string('title', 60).notNullable();
      t.string('type', 35).notNullable();
      t.string('rev_desc', 250).notNullable();
      t.string('file_name', 35).notNullable();
      t.integer('doc_id').notNullable();
      t.integer('poster_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('course_user', t => {
      t.increments('id');
      t.boolean('tutor_status').notNullable().defaultTo(false);
      t.boolean('tutor_available').notNullable().defaultTo(false);
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('user_id').notNullable().references('users.id');
      t.timestamp('sub_date').defaultTo(knex.fn.now());
      t.timestamp('unsub_date');
      t.string('unsub_reason', 35);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('course_user'),
    knex.schema.dropTable('revisions'),
    knex.schema.dropTable('users'),
  ]);
};
