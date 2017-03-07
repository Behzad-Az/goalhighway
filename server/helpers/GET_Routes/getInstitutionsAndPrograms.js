const getInstitutionsAndPrograms = (req, res, knex, user_id) => {

  const getAllInstitutions = () => {
    return knex('institutions');
  };

  const getAllPrograms = () => {
    return knex('programs').innerJoin('institution_program', 'programs.id', 'prog_id');
  };

  Promise.all([
    getAllInstitutions(),
    getAllPrograms()
  ]).then(results => {
    let insts = results[0];
    let programs = results[1];

    insts.forEach(inst => {
      inst.programs = programs.filter(prog => prog.inst_id === inst.id);
    });
    res.send(insts);
  }).catch(err => {
    console.error("Error inside getInstitutionsAndPrograms.js: ", err);
    res.send(false);
  });

};

module.exports = getInstitutionsAndPrograms;
