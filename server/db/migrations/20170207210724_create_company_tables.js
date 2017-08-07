
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('interview_questions', t => {
      // t.bigIncrements('id');
      t.string('id', 11).notNullable().unique();
      t.string('question', 250).notNullable();
      t.integer('like_count').notNullable().defaultTo(0);
      t.string('company_id', 11).notNullable();
      t.string('poster_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('interview_answers', t => {
      // t.bigIncrements('id');
      t.string('id', 11).notNullable().unique();
      t.string('answer', 500).notNullable();
      t.string('outcome', 35).notNullable();
      t.string('poster_id', 11).notNullable().references('users.id');
      t.string('question_id', 11).notNullable();
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
