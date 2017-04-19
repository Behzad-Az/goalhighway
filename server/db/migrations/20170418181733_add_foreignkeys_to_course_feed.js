
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('course_feed', t => {
      t.integer('tutor_log_id').references('tutor_log');
      t.integer('item_for_sale_id').references('items_for_sale.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('course_feed', t => {
      t.dropColumn('tutor_log_id');
      t.dropColumn('item_for_sale_id');
    })
  ]);
};
