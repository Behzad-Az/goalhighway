let institutions = [
  { inst_short_name: 'UBC', inst_long_name: 'University of British Columbia', id: 1, province: 'British Columbia', country: 'canada' },
  { inst_short_name: 'SFU', inst_long_name: 'Simon Fraser University', id: 2, province: 'British Columbia', country: 'canada' }
];

const getInstValue = inst_long_name => inst_long_name.toLowerCase().replace(/ /g, '_');
const getInstDisplayName = (inst_long_name, inst_short_name) => inst_short_name ? inst_long_name + ` (${inst_short_name})` : inst_long_name;

exports.seed = function(knex, Promise) {
  let promiseArr = [];
  institutions.forEach(inst => {
    inst.inst_value = getInstValue(inst.inst_long_name);
    inst.inst_display_name = getInstDisplayName(inst.inst_long_name, inst.inst_short_name);
    promiseArr.push(knex('institutions').insert(inst));
  });
  return Promise.all(promiseArr);
};
