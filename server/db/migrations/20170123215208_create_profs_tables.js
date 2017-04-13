
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('profs', (t) => {
      t.increments('id');
      t.string('name', 60).notNullable();
      t.integer('inst_id').notNullable().references('institutions.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    }),

    knex.schema.createTableIfNotExists('course_reviews', (t) => {
      t.increments('id');
      t.integer('start_year').notNullable();
      t.string('start_month').notNullable();
      t.integer('workload_rating').notNullable();
      t.integer('fairness_rating').notNullable();
      t.integer('prof_rating').notNullable();
      t.integer('overall_rating').notNullable();
      t.string('review_desc', 400).notNullable().defaultTo('No description provided...');
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('reviewer_id').notNullable().references('users.id');
      t.integer('prof_id').references('profs.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('course_reviews'),
    knex.schema.dropTable('profs')
  ]);
};
