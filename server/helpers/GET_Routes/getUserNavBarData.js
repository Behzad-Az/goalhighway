const getUserNavBarData = (req, res, knex, user_id) => {
  const userInfo = {
    id: req.session.user_id,
    username: req.session.username,
    email: req.session.email,
    user_year: req.session.user_year,
    inst_prog_id: req.session.inst_prog_id,
    inst_id: req.session.inst_id,
    prog_id: req.session.prog_id
  };
  res.send({ userInfo });
};

module.exports = getUserNavBarData;
