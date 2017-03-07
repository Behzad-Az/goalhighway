
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', t => {
      t.string('postal_code', 10);
      t.float('lat', 8, 5);
      t.float('lon', 8, 5);
      t.string('job_query', 250);
      t.string('job_kind', 100);
      t.integer('job_distance');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', t => {
      t.dropColumn('postal_code');
      t.dropColumn('lat');
      t.dropColumn('lon');
      t.dropColumn('job_query');
      t.dropColumn('job_kind');
      t.dropColumn('job_distance');
    })
  ]);
};
