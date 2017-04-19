
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('items_for_sale', (t) => {
      t.increments('id');
      t.string('title', 100).notNullable();
      t.string('item_desc', 400).notNullable();
      t.string('photo_name', 50).notNullable().defaultTo('default_photo_path');
      t.string('price', 50).notNullable();
      t.integer('course_id').notNullable().references('courses.id');
      t.integer('owner_id').notNullable().references('users.id');
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
