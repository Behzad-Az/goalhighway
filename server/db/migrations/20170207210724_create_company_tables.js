
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('companies', t => {
      t.increments('id');
      t.string('name', 50).notNullable();
      t.timestamp('flag_created_at').notNullable().defaultTo(knex.fn.now());
    }),

    knex.schema.createTableIfNotExists('interview_questions', t => {
      t.increments('id');
      t.string('question', 250).notNullable();
      t.integer('like_count').notNullable().defaultTo(0);
      t.integer('company_id').notNullable().references('companies.id');
      t.integer('question_poster_id').notNullable().references('users.id');
      t.timestamp('question_created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('question_deleted_at');
    }),

    knex.schema.createTableIfNotExists('interview_answers', t => {
      t.increments('id');
      t.string('answer', 1000).notNullable();
      t.string('outcome', 20).notNullable().defaultTo("unknown");
      t.integer('answer_poster_id').notNullable().references('users.id');
      t.integer('question_id').notNullable().references('interview_questions.id');
      t.timestamp('answer_created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('answer_deleted_at');
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
