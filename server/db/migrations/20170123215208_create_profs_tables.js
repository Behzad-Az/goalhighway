
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('profs', (t) => {
      t.increments('id');
      t.string('name', 60).notNullable();
      t.integer('inst_id').notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('course_reviews', (t) => {
      t.increments('id');
      t.integer('start_year').notNullable();
      t.string('start_month', 10).notNullable();
      t.integer('workload_rating').notNullable();
      t.integer('fairness_rating').notNullable();
      t.integer('prof_rating').notNullable();
      t.integer('overall_rating').notNullable();
      t.string('review_desc', 500).notNullable();
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('reviewer_id').notNullable().references('users.id');
      t.integer('prof_id').references('profs.id');
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
