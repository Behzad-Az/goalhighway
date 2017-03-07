const getUserNavBarData = (req, res, knex, user_id) => {

  let userInfo = [];

  const getUserProfile = () => knex('users')
    .innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
    .select('users.id', 'username', 'email', 'user_year', 'inst_prog_id', 'inst_id')
    .where('users.id', user_id);

  const getNotifications = () => knex('notifications').innerJoin('users', 'from_id', 'users.id').where('to_id', user_id).orderBy('notif_created_at', 'desc');

  Promise.all([
    getUserProfile(),
    getNotifications()
  ]).then(results => {
    let userInfo = results[0][0];
    let notifications = results[1];
    res.send({ userInfo, notifications });
  }).catch(err => {
    console.error("Error inside getUserNavBarData.js: ", err);
    res.send(false);
  });
};

module.exports = getUserNavBarData;
