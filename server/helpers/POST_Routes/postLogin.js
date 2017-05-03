const postLogin = (req, res, knex, bcrypt) => {

  let currUser;
  const username = req.body.username.trim().toLowerCase();
  const password = req.body.password;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      username.length >= 3 && username.length <= 30 && username.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1 &&
      password.length >= 6 && password.length <= 30 && password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1
    ) {
      resolve();
    } else {
      reject('Invalid form inputs');
    }
  });

  const findUser = () => knex('users')
    .innerJoin('institution_program', 'inst_prog_id', 'institution_program.id')
    .select(
      'users.id', 'users.username', 'users.photo_name', 'users.inst_prog_id', 'users.email', 'users.user_year', 'users.password', 'users.created_at',
      'institution_program.inst_id', 'institution_program.prog_id'
    )
    .where('username', username)
    .whereNull('users.deleted_at');

  const verifyPwd = (given, actual) => bcrypt.compare(given, actual);

  validateInputs()
  .then(() => findUser())
  .then(user => {
    currUser = user[0];
    return verifyPwd(password, currUser.password);
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
