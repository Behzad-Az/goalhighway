const postNewUser = (req, res, knex, bcrypt, esClient) => {

  let academicYears = [1, 2, 3, 4, 5, 6];

  const verifyOtherInputs = () => {
    let emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return req.body.username.trim().toLowerCase().length >= 3 && academicYears.includes(parseInt(req.body.userYear)) && req.body.email.trim().toLowerCase().match(emailRegex);
  };

  const verifyInputs = () => new Promise ((resolve, reject) => {
    let pwd = req.body.password;
    let pwdConfirm = req.body.passwordConfirm;
    if (pwd !== pwdConfirm) {
      reject('not_matching');
    } else if (pwd.length < 6) {
      reject('too_short');
    } else if (pwd.length > 30) {
      reject('too_long');
    } else if (pwd.search(/\d/) == -1) {
      reject('no_num');
    } else if (pwd.search(/[a-zA-Z]/) == -1) {
      reject('no_letter');
    } else if (pwd.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
      reject('bad_char');
    } else if (!verifyOtherInputs()) {
      reject('bad_other_input');
    }
    resolve('ok');
  });

  const findInstProgId = () => knex('institution_program')
    .select('id')
    .where('inst_id', req.body.instId)
    .andWhere('prog_id', req.body.progId);

  const insertUser = newUserObj => knex('users').insert(newUserObj);

  Promise.all([
    verifyInputs(req.body.password, req.body.passwordConfirm),
    bcrypt.hash(req.body.password, 10),
    findInstProgId()
  ])
  .then(results => {
    let newUserObj = {
      username: req.body.username.trim().toLowerCase(),
      email: req.body.email.trim().toLowerCase(),
      password: results[1],
      user_year: req.body.userYear,
      inst_prog_id: results[2][0] && results[2][0].id
    };
    return insertUser(newUserObj);
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewUser.js: ', err);
    res.send(false);
  });

};

module.exports = postNewUser;
