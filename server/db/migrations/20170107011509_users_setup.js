exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('users', t => {
      t.string('id', 11).notNullable().unique();
      t.string('username', 30).notNullable().unique();
      t.string('password', 60).notNullable();
      t.string('email', 30).notNullable().unique();
      t.integer('user_year').notNullable();
      t.string('postal_code', 10);
      t.float('lat', 8, 5);
      t.float('lon', 8, 5);
      t.string('job_query', 250);
      t.string('job_kind', 100);
      t.integer('job_distance');
      t.string('photo_name', 35).notNullable().defaultTo('default_user_photo.png');
      t.boolean('confirmed').notNullable().defaultTo(false);
      t.string('register_token', 35).notNullable().unique();
      t.string('inst_prog_id', 11).notNullable().references('institution_program.id');
      t.timestamp('last_feed_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('revisions', t => {
      t.string('id', 11).notNullable().unique();
      t.string('title', 60).notNullable();
      t.string('type', 35).notNullable();
      t.string('rev_desc', 250).notNullable();
      t.string('file_name', 35).notNullable();
      t.string('doc_id', 11).notNullable();
      t.string('poster_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('course_user', t => {
      t.string('id', 11).notNullable().unique();
      t.boolean('tutor_status').notNullable().defaultTo(false);
      t.boolean('tutor_available').notNullable().defaultTo(false);
      t.string('course_id', 11).notNullable().references('courses.id');
      t.string('user_id', 11).notNullable().references('users.id');
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
