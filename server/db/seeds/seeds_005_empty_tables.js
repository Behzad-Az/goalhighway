exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw("delete from programs where 1=1")
  ]);
};
