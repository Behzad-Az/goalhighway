const postLogin = (req, res, knex, bcrypt) => {

  let currUser, username = req.body.username.toLowerCase();

  const findUser = () => knex('users')
    .innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
    .select('users.id', 'username', 'password', 'inst_prog_id', 'inst_id', 'prog_id', 'email', 'user_year')
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
