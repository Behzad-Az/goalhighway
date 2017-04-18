
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('company_reviews', t => {
      t.increments('id');
      t.string('title', 100).notNullable();
      t.string('position', 100).notNullable();
      t.string('reviwer_background', 100).notNullable();
      t.integer('start_year').notNullable();
      t.string('start_month', 10).notNullable();
      t.integer('end_year').notNullable();
      t.string('end_month', 10).notNullable();
      t.string('training', 15).notNullable();
      t.string('salary', 15).notNullable();
      t.string('pros', 500).defaultTo('No detail provided');
      t.string('cons', 500).defaultTo('No detail provided');
      t.string('overall', 15).notNullable();
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