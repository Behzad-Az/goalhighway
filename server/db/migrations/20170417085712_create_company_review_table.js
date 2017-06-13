
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('company_reviews', t => {
      t.bigIncrements('id');
      t.string('position', 60).notNullable();
      t.string('position_type', 35).notNullable();
      t.string('reviewer_background', 60).notNullable();
      t.integer('start_year').notNullable();
      t.string('start_month', 10).notNullable();
      t.integer('work_duration').notNullable();
      t.integer('training_rating').notNullable();
      t.integer('relevancy_rating').notNullable();
      t.integer('pay_rating').notNullable();
      t.integer('overall_rating').notNullable();
      t.string('pros', 500).notNullable();
      t.string('cons', 500).notNullable();
      t.integer('reviewer_id').notNullable().references('users.id');
      t.integer('company_id').notNullable().references('companies.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('company_reviews')
  ]);
};
