const getUserNavBarData = (req, res, knex, user_id) => {

  const getNotifications = () => knex('notifications')
    .innerJoin('users', 'from_id', 'users.id')
    .where('to_id', user_id)
    .orderBy('notif_created_at', 'desc');

  getNotifications()
  .then(notifications => {
    const userInfo = {
      id: req.session.user_id,
      username: req.session.username,
      email: req.session.email,
      user_year: req.session.user_year,
      inst_prog_id: req.session.inst_prog_id,
      inst_id: req.session.inst_id,
      prog_id: req.session.prog_id
    };

    res.send({ userInfo, notifications });
  })
  .catch(err => {
    console.error('Error inside getUserNavBarData.js: ', err);
    res.send(false);
  });
};

module.exports = getUserNavBarData;
