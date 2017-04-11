exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from institutions where 1=1')
  ]);
};
