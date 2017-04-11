exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('delete from profs where 1=1'),
    knex.raw('delete from users where 1=1')
  ]);
};
