const postLogin = (req, res, knex, bcrypt) => {

  const username = req.body.username.trim().toLowerCase();
  const password = req.body.password;
  const ip_address = req.connection.remoteAddress;
  let currUser;

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      username.length >= 3 && username.length <= 30 &&
      username.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1 &&
      password.length >= 6 && password.length <= 30 &&
      password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1
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
      'users.postal_code', 'users.job_query', 'users.job_kind', 'users.job_distance', 'users.lat', 'users.lon',
      'institution_program.inst_id', 'institution_program.prog_id'
    )
    .where('username', username)
    .andWhere('confirmed', true)
    .whereNull('users.deleted_at');

  const verifyPwd = (given, actual) => bcrypt.compare(given, actual);

  const insertLoginHistory = user_id => knex('login_history')
    .insert({ user_id, ip_address });

  validateInputs()
  .then(() => findUser())
  .then(user => {
    if (user[0]) {
      currUser = user[0];
      return verifyPwd(password, currUser.password);
    } else {
      throw 'No username could be found or user has not verified email yet';
    }
  })
  .then(valid => {
    if (valid) { return insertLoginHistory(currUser.id); }
    else { throw 'Invalid username and password'; }
  })
  .then(() => {
    req.session.username = username;
    req.session.user_id = currUser.id;
    req.session.inst_prog_id = currUser.inst_prog_id;
    req.session.inst_id = currUser.inst_id;
    req.session.prog_id = currUser.prog_id;
    req.session.email = currUser.email;
    req.session.user_year = currUser.user_year;
    req.session.photo_name = currUser.photo_name;
    req.session.created_at = currUser.created_at;
    req.session.postal_code = currUser.postal_code;
    req.session.lat = currUser.lat;
    req.session.lon = currUser.lon;
    req.session.job_kind = currUser.job_kind;
    req.session.job_query = currUser.job_query;
    req.session.job_distance = currUser.job_distance;
    res.send(true);
  })
  .catch(err => {
    console.error('Error inside postLogin.js', err);
    res.send(false);
  });

};

module.exports = postLogin;
