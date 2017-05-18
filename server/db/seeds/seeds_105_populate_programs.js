let programs = [
  { prog_short_name: 'not avail.', prog_long_name: 'Engineering' },
  { prog_short_name: 'not avail.', prog_long_name: 'Sciences' },
  { prog_short_name: 'not avail.', prog_long_name: 'Fine Arts' },
  { prog_short_name: 'not avail.', prog_long_name: 'Commerce' },
  { prog_short_name: 'not avail.', prog_long_name: 'Other' }
];

const getProgValue = prog_long_name => prog_long_name.toLowerCase().replace(/ /g, '_');
const getProgDisplayName = (prog_long_name, prog_short_name) => prog_short_name === 'not avail.' ? prog_long_name : prog_long_name + ` (${prog_short_name})`;

exports.seed = function(knex, Promise) {
  let promiseArr = [];
  programs.forEach(prog => {
    prog.prog_value = getProgValue(prog.prog_long_name);
    prog.prog_display_name = getProgDisplayName(prog.prog_long_name, prog.prog_short_name);
    promiseArr.push(knex('programs').insert(prog));
  });
  return Promise.all(promiseArr);
};
