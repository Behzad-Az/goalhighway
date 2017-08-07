
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('course_feed', t => {
      t.string('tutor_log_id', 11).references('tutor_log.id');
      t.string('item_for_sale_id', 11).references('items_for_sale.id');
      t.string('course_review_id', 11).references('course_reviews.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('course_feed', t => {
      t.dropColumn('tutor_log_id');
      t.dropColumn('item_for_sale_id');
      t.dropColumn('course_review_id');
    })
  ]);
};
