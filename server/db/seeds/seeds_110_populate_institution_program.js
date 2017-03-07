exports.seed = function(knex, Promise) {
  let promiseArr = [];
  let tabledata = [];

  let numPrograms = 5;
  let institution_id = 1;
  for (let i = 1; i <= numPrograms; i++) {
    tabledata.push({
      inst_id: institution_id,
      prog_id: i
    });
  }

  numPrograms = 3;
  institution_id = 2;
  for (let i = 1; i <= numPrograms; i++) {
    tabledata.push({
      inst_id: institution_id,
      prog_id: i
    });
  }

  tabledata.forEach((data) => {
    promiseArr.push(knex('institution_program').insert(data));
  });
  return Promise.all(promiseArr);
};
