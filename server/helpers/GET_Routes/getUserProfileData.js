const getUserProfileData = (req, res, knex, user_id) => {

  const getUsersInstAndProg = () => knex('users')
    .innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .innerJoin('programs', 'prog_id', 'programs.id')
    .select(
      'users.id', 'users.username', 'users.email', 'users.user_year', 'users.inst_prog_id', 'users.photo_name',
      'users.postal_code', 'users.lat', 'users.lon', 'users.job_kind', 'users.job_query', 'users.job_distance',
      'institution_program.inst_id', 'institution_program.prog_id',
      'institutions.inst_display_name', 'programs.prog_display_name'
    )
    .where('users.id', user_id);

  getUsersInstAndProg()
  .then(results => res.send({ userInfo: results[0] }))
  .catch(err => {
    console.error('Error in getUserProfileData.js: ', err);
    res.send(false);
  });

};

module.exports = getUserProfileData;
