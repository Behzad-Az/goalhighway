exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from docs where 1=1')
  ]);
};
