const getInstitutionsAndPrograms = (req, res, knex, user_id) => {

  const getAllInstitutions = () => knex('institutions')
    .select('id', 'inst_display_name')
    .whereNull('deleted_at');

  const getAllPrograms = () => knex('programs')
    .innerJoin('institution_program', 'programs.id', 'institution_program.prog_id')
    .select('programs.id', 'programs.prog_display_name', 'institution_program.inst_id')
    .whereNull('institution_program.deleted_at')
    .whereNull('programs.deleted_at');

  Promise.all([
    getAllInstitutions(),
    getAllPrograms()
  ])
  .then(results => {
    const insts = results[0].map(inst => {
      inst.programs = results[1].filter(prog => prog.inst_id == inst.id);
      return inst;
    });
    res.send({ insts });
  })
  .catch(err => {
    console.error('Error inside getInstitutionsAndPrograms.js: ', err);
    res.send(false);
  });

};

module.exports = getInstitutionsAndPrograms;
