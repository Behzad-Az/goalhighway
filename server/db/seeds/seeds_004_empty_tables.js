exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from institution_program where 1=1')
  ]);
};
