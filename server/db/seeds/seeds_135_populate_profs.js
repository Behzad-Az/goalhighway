const fs = require('fs');

const profsRaw = fs.readFileSync(__dirname + '/ubc_mech_profs.json');
const profs = JSON.parse(profsRaw);

exports.seed = function(knex, Promise) {
  let promiseArr = profs.map(prof => {
    const profObj = {
      name: `${prof.prefix} ${prof.first_name} ${prof.last_name}`,
      inst_id: prof.inst_id,
      id: prof.id
    };
    return knex('profs').insert(profObj);
  });
  promiseArr.push(knex('profs').insert({ id: 'eOp3Gjo4s3U', inst_id: 'KliraFQhB6c', name: 'Unknown'}));
  return Promise.all(promiseArr);
};
