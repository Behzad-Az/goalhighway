let programs = [
  { id: 'BgnavDcD69g', prog_short_name: 'not avail.', prog_long_name: 'Mechanical Engineering' },
  { id: 'oefQCzPT0l0', prog_short_name: 'not avail.', prog_long_name: 'Electrical Engineering' },
  { id: '2pgU6ZsLl9b', prog_short_name: 'not avail.', prog_long_name: 'Civil Engineering' },
  { id: '0PyMhx0kEt7', prog_short_name: 'not avail.', prog_long_name: 'Environmental Engineering' },
  { id: '2x6MF6xHKSG', prog_short_name: 'not avail.', prog_long_name: 'Computer Engineering' },
  { id: 'S8E1WBWlHyE', prog_short_name: 'not avail.', prog_long_name: 'Other' }
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
