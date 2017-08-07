
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('conversations', t => {
      t.string('id', 11).notNullable().unique();
      t.string('subject', 60).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),
    knex.schema.createTableIfNotExists('conversation_messages', t => {
      t.string('id', 11).notNullable().unique();
      t.string('content', 500).notNullable();
      t.string('conversation_id', 11).notNullable().references('conversations.id');
      t.string('sender_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),
    knex.schema.createTableIfNotExists('conversation_members', t => {
      t.string('id', 11).notNullable().unique();
      t.string('user_id', 11).notNullable().references('users.id');
      t.string('conversation_id', 11).notNullable().references('conversations.id');
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
