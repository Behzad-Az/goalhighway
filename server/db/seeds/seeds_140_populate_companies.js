const companies = [
  { name: 'Home Inc.', id: 1 },
  { name: 'Ballard Power Systems', id: 2 },
  { name: 'NCIS Facility - UBC', id: 3 },
  { name: 'Apple Inc.', id: 4 }
];

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('companies').insert(companies)
  ]);
};
