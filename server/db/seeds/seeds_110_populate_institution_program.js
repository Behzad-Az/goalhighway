exports.seed = function(knex, Promise) {

  let tabledata = [];

  for (let prog_id = 1; prog_id <= 5; prog_id++) {
    tabledata.push({
      inst_id: 1,
      prog_id
    });
  }

  for (let prog_id = 1; prog_id <= 3; prog_id++) {
    tabledata.push({
      inst_id: 2,
      prog_id
    });
  }

  return Promise.all(tabledata.map(data => knex('institution_program').insert(data)));
};
