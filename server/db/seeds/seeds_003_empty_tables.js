exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from courses where 1=1')
  ]);
};
