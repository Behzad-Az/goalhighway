const postNewUser = (req, res, knex, bcrypt) => {

  const username = req.body.username.trim().toLowerCase();
  const pwd = req.body.password.trim();
  const pwdConfirm = req.body.passwordConfirm.trim();
  const email = req.body.email.trim().toLowerCase();
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const validateInputs = () => new Promise ((resolve, reject) => {
    if (
      pwd === pwdConfirm &&
      pwd.length >= 6 && pwd.length <= 30 &&
      pwd.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1 &&
      pwd.search(/\d/) != -1 &&
      pwd.search(/[a-zA-Z]/) != -1 &&
      username.length >= 3 && username.length <= 30 &&
      username.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1 &&
      email.length >= 6 && email.length <= 30 &&
      email.match(emailRegex) &&
      [1, 2, 3, 4, 5, 6].includes(parseInt(req.body.userYear)) &&
      req.body.instId &&
      req.body.progId
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const findInstProgId = () => knex('institution_program')
    .select('id')
    .where('inst_id', req.body.instId)
    .andWhere('prog_id', req.body.progId)
    .whereNull('deleted_at');

  const insertUser = newUserObj => knex('users')
    .insert(newUserObj);

  validateInputs()
  .then(() => Promise.all([ bcrypt.hash(pwd, 10), findInstProgId() ]))
  .then(results => insertUser({
    username,
    email,
    password: results[0],
    user_year: req.body.userYear,
    inst_prog_id: results[1][0].id
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewUser.js: ', err);
    res.send(false);
  });

};

module.exports = postNewUser;
