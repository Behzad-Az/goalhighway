const postLogin = (req, res, knex, bcrypt) => {

  let currUser, username = req.body.username.toLowerCase();

  const findUser = () => knex('users')
    .innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
    .select(
      'users.id', 'users.username', 'users.photo_name', 'users.inst_prog_id', 'users.email', 'users.user_year', 'users.password', 'users.created_at',
      'institution_program.inst_id', 'institution_program.prog_id'
    )
    .where('username', username);

  const verifyPwd = (given, actual) => bcrypt.compare(given, actual);

  findUser()
  .then(user => {
    currUser = user[0];
    return verifyPwd(req.body.password, currUser.password);
  })
  .then(valid => {
    if (valid) {
      req.session.username = username;
      req.session.user_id = currUser.id;
      req.session.inst_prog_id = currUser.inst_prog_id;
      req.session.inst_id = currUser.inst_id;
      req.session.prog_id = currUser.prog_id;
      req.session.email = currUser.email;
      req.session.user_year = currUser.user_year;
      req.session.photo_name = currUser.photo_name;
      req.session.created_at = currUser.created_at;
      res.send(true);
    } else {
      throw 'Invalid username and password';
    }
  })
  .catch(err => {
    console.error('Error inside postLogin.js: ', err);
    res.send(false);
  });

};

module.exports = postLogin;
