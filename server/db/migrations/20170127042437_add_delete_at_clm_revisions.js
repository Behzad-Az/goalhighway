
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('revisions', (t) => {
      t.timestamp('deleted_at');
    }),
    knex.schema.table('docs', (t) => {
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('revisions', (t) => {
      t.dropColumn('deleted_at');
    }),
    knex.schema.table('docs', (t) => {
      t.dropColumn('deleted_at');
    })
  ]);
};
