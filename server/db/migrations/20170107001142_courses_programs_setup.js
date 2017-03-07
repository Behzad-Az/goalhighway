
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('institutions', (t) => {
      t.increments('id');
      t.string('inst_short_name', 20).notNullable().defaultTo("n/a");
      t.string('inst_long_name', 100).notNullable();
      t.string('inst_value', 100).notNullable();
      t.string('inst_display_name', 125).notNullable();
      t.string('country').notNullable().defaultTo('Canada');
      t.string('province').notNullable().defaultTo('British Columbia');
      t.timestamp('inst_created_at').notNullable().defaultTo(knex.raw('now()'));
    }),

    knex.schema.createTableIfNotExists('programs', (t) => {
      t.increments('id');
      t.string('prog_short_name', 20).notNullable().defaultTo("n/a");
      t.string('prog_long_name', 100).notNullable();
      t.string('prog_value', 100).notNullable();
      t.string('prog_display_name', 125).notNullable();
      t.timestamp('prog_created_at').notNullable().defaultTo(knex.raw('now()'));
    }),

    knex.schema.createTableIfNotExists('institution_program', (t) => {
      t.increments('id');
      t.integer('inst_id').notNullable().references('institutions.id');
      t.integer('prog_id').notNullable().references('programs.id');
      t.timestamp('inst_prog_created_at').notNullable().defaultTo(knex.raw('now()'));
    }),

    knex.schema.createTableIfNotExists('courses', (t) => {
      t.increments('id');
      t.string('prefix', 20).notNullable();
      t.string('suffix', 20).notNullable();
      t.string('full_display_name', 300).notNullable();
      t.string('short_display_name', 50).notNullable();
      t.string('course_desc', 250).notNullable().defaultTo("no desc");
      t.integer('course_year').notNullable();
      t.integer('inst_id').notNullable().references('institutions.id');
      t.timestamp('course_created_at').notNullable().defaultTo(knex.raw('now()'));
    }),

    knex.schema.createTableIfNotExists('docs', (t) => {
      t.increments('id');
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('like_count').notNullable().defaultTo(0);
      t.timestamp('doc_created_at').notNullable().defaultTo(knex.raw('now()'));
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('docs'),
    knex.schema.dropTable('courses'),
    knex.schema.dropTable('institution_program'),
    knex.schema.dropTable('programs'),
    knex.schema.dropTable('institutions')
  ]);
};
