const postNewUser = (req, res, knex, bcrypt, esClient) => {

  const username = req.body.username.trim().toLowerCase();
  const email = req.body.email.trim().toLowerCase();

  const verifyOtherInputs = () => {
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return username.length >= 3 && username.length <= 30 &&
           email.length >= 6 && email.length <= 30 && email.match(emailRegex) &&
           [1, 2, 3, 4, 5, 6].includes(parseInt(req.body.userYear));
  };

  const validateInputs = () => new Promise ((resolve, reject) => {
    const pwd = req.body.password;
    const pwdConfirm = req.body.passwordConfirm;
    if (pwd !== pwdConfirm) {
      reject('password not_matching');
    } else if (pwd.length < 6) {
      reject('password too_short');
    } else if (pwd.length > 30) {
      reject('password too_long');
    } else if (pwd.search(/\d/) == -1) {
      reject('password no_num');
    } else if (pwd.search(/[a-zA-Z]/) == -1) {
      reject('password no_letter');
    } else if (pwd.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
      reject('password bad_char');
    } else if (!verifyOtherInputs()) {
      reject('bad_other_input');
    }
    resolve();
  });

  const findInstProgId = () => knex('institution_program')
    .select('id')
    .where('inst_id', req.body.instId)
    .andWhere('prog_id', req.body.progId)
    .whereNull('deleted_at');

  const insertUser = newUserObj => knex('users').insert(newUserObj);

  validateInputs()
  .then(() => Promise.all([ bcrypt.hash(req.body.password, 10), findInstProgId() ]))
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
