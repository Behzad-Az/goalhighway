const getUserProfileData = (req, res, knex, user_id) => {

  const getUsersInstAndProg = () => {
    return knex('users').innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
                 .innerJoin('institutions', 'inst_id', 'institutions.id')
                 .innerJoin('programs', 'prog_id', 'programs.id')
                 .select('users.id', 'username', 'email', 'user_year', 'inst_id', 'inst_display_name',
                         'prog_id', 'prog_display_name', 'inst_prog_id', 'postal_code', 'lat', 'lon',
                         'job_kind', 'job_query', 'job_distance')
                 .where('users.id', user_id);
  };

  getUsersInstAndProg().then(results => {
    let userInfo = results[0];
    res.send( userInfo );
  }).catch(err => {
    console.error('Error in getUserProfileData.js: ', err);
    res.send(false);
  });

};

module.exports = getUserProfileData;
