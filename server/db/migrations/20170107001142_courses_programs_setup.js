
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('institutions', t => {
      t.increments('id');
      t.string('inst_short_name', 10).notNullable();
      t.string('inst_long_name', 60).notNullable();
      t.string('inst_value', 60).notNullable();
      t.string('inst_display_name', 75).notNullable();
      t.string('country', 35).notNullable();
      t.string('province', 35).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('programs', t => {
      t.increments('id');
      t.string('prog_short_name', 10).notNullable();
      t.string('prog_long_name', 60).notNullable();
      t.string('prog_value', 60).notNullable();
      t.string('prog_display_name', 75).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('institution_program', t => {
      t.increments('id');
      t.integer('inst_id').notNullable().references('institutions.id');
      t.integer('prog_id').notNullable().references('programs.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('courses', t => {
      t.increments('id');
      t.string('prefix', 10).notNullable();
      t.string('suffix', 10).notNullable();
      t.string('full_display_name', 130).notNullable();
      t.string('short_display_name', 25).notNullable();
      t.string('course_desc', 250).notNullable();
      t.integer('course_year').notNullable();
      t.integer('inst_id').notNullable().references('institutions.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('docs', t => {
      t.increments('id');
      t.integer('course_id').notNullable().references('courses.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
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
