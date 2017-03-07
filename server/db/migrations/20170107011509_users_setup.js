
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('users', (t) => {
      t.increments('id');
      t.string('username', 30).notNullable().unique();
      t.string('password', 64).notNullable().defaultTo("pswd");
      t.string('email', 30).notNullable().unique();
      t.integer('user_year').notNullable();
      t.integer('inst_prog_id').notNullable().references('institution_program.id');
      t.timestamp('user_created_at').notNullable().defaultTo(knex.raw('now()'));
    }),

    knex.schema.createTableIfNotExists('revisions', (t) => {
      t.increments('id');
      t.string('type', 50).notNullable();
      t.string('title', 100).notNullable();
      t.string('rev_desc', 250).notNullable().defaultTo("no desc");
      t.string('file_path', 200).notNullable();
      t.integer('doc_id').notNullable();
      t.integer('user_id').notNullable().references('users.id').defaultTo(1);
      t.timestamp('rev_created_at').notNullable().defaultTo(knex.raw('now()'));
    }),

    knex.schema.createTableIfNotExists('course_user', (t) => {
      t.increments('id');
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('user_id').notNullable().references('users.id');
      t.timestamp('course_user_created_at').notNullable().defaultTo(knex.raw('now()'));
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
