
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('revisions', (t) => {
      t.timestamp('rev_deleted_at');
    }),
    knex.schema.table('docs', (t) => {
      t.timestamp('doc_deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('revisions', (t) => {
      t.dropColumn('rev_deleted_at');
    }),
    knex.schema.table('docs', (t) => {
      t.dropColumn('doc_deleted_at');
    })
  ]);
};
