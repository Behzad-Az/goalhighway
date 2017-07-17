
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('items_for_sale', (t) => {
      t.bigIncrements('id');
      t.string('title', 60).notNullable();
      t.string('item_desc', 250).notNullable();
      t.string('photo_name', 35).notNullable();
      t.string('price', 10).notNullable();
      t.integer('course_id').notNullable().references('courses.id');
      t.string('owner_id', 11).notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items_for_sale')
  ]);
};
