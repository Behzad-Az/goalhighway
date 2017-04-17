
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('companies', t => {
      t.increments('id');
      t.string('name', 50).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('interview_questions', t => {
      t.increments('id');
      t.string('question', 250).notNullable();
      t.integer('like_count').notNullable().defaultTo(0);
      t.integer('company_id').notNullable().references('companies.id');
      t.integer('poster_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('interview_answers', t => {
      t.increments('id');
      t.string('answer', 1000).notNullable();
      t.string('outcome', 20).notNullable().defaultTo('Unknown');
      t.integer('poster_id').notNullable().references('users.id');
      t.integer('question_id').notNullable().references('interview_questions.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('interview_answers'),
    knex.schema.dropTable('interview_questions'),
    knex.schema.dropTable('companies')
  ]);
};
