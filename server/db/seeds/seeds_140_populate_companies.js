const companies = [
  { name: 'Home Inc.', id: 1 },
  { name: 'Ballard Power Systems', id: 2 },
  { name: 'Apple Inc.', id: 3 },
  { name: 'NCIS Facility - UBC', id: 4 }
];

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('companies').insert(companies)
  ]);
};
