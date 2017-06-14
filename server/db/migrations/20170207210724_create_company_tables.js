
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('interview_questions', t => {
      t.bigIncrements('id');
      t.string('question', 250).notNullable();
      t.integer('like_count').notNullable().defaultTo(0);
      t.string('company_id', 20).notNullable();
      t.integer('poster_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('interview_answers', t => {
      t.bigIncrements('id');
      t.string('answer', 500).notNullable();
      t.string('outcome', 35).notNullable();
      t.integer('poster_id').notNullable().references('users.id');
      t.integer('question_id').notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('interview_answers'),
    knex.schema.dropTable('interview_questions')
  ]);
};
