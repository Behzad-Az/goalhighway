
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('profs', t => {
      // t.bigIncrements('id');
      t.string('id', 11).notNullable().unique();
      t.string('name', 60).notNullable();
      t.string('inst_id', 11).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('course_reviews', t => {
      // t.bigIncrements('id');
      t.string('id', 11).notNullable().unique();
      t.integer('start_year').notNullable();
      t.string('start_month', 10).notNullable();
      t.integer('workload_rating').notNullable();
      t.integer('fairness_rating').notNullable();
      t.integer('prof_rating').notNullable();
      t.integer('overall_rating').notNullable();
      t.string('review_desc', 500).notNullable();
      t.string('course_id', 11).notNullable().references('courses.id');
      t.string('reviewer_id', 11).notNullable().references('users.id');
      t.string('prof_id', 11).references('profs.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('course_reviews'),
    knex.schema.dropTable('profs')
  ]);
};
