
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('course_feed', t => {
      t.integer('tutor_log_id').references('tutor_log');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('course_feed', t => {
      t.dropColumn('tutor_log_id');
    })
  ]);
};
