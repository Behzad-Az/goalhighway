let programs = [
  { prog_short_name: 'ELEC', prog_long_name: 'Electrical Eng' },
  { prog_short_name: 'MECH', prog_long_name: 'Mechanical Eng' },
  { prog_short_name: 'CPSC', prog_long_name: 'Computer Eng' },
  { prog_short_name: 'CVIL', prog_long_name: 'Civil Eng' },
  { prog_short_name: 'CHEM', prog_long_name: 'Chemical Eng' }
];

const getProgValue = prog_long_name => prog_long_name.toLowerCase().replace(/ /g, "_");
const getProgDisplayName = (prog_long_name, prog_short_name) => prog_short_name ? prog_long_name + ` (${prog_short_name})` : prog_long_name;

exports.seed = function(knex, Promise) {
  let promiseArr = [];
  programs.forEach(prog => {
    prog.prog_value = getProgValue(prog.prog_long_name);
    prog.prog_display_name = getProgDisplayName(prog.prog_long_name, prog.prog_short_name);
    promiseArr.push(knex('programs').insert(prog));
  });
  return Promise.all(promiseArr);
};
