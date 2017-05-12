
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('conversations', t => {
      t.increments('id');
      t.string('subject', 60).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),
    knex.schema.createTableIfNotExists('conversation_messages', t => {
      t.increments('id');
      t.string('content', 500).notNullable();
      t.integer('conversation_id').notNullable().references('conversations.id');
      t.integer('sender_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),
    knex.schema.createTableIfNotExists('conversation_members', t => {
      t.increments('id');
      t.integer('user_id').notNullable().references('users.id');
      t.integer('conversation_id').notNullable().references('conversations.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('conversation_messages'),
    knex.schema.dropTable('conversation_members'),
    knex.schema.dropTable('conversations')
  ]);
};
