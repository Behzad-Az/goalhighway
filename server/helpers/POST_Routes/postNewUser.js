const confirmEmailTemplate = require('../Email_Templates/confirmEmailTemplate.js');

const postNewUser = (req, res, knex, bcrypt, mailer) => {

  const username = req.body.username.trim().toLowerCase();
  const pwd = req.body.password.trim();
  const pwdConfirm = req.body.passwordConfirm.trim();
  const email = req.body.email.trim().toLowerCase();
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  const user_year = parseInt(req.body.userYear);

  const mailOptions = {
    from: '"GoalHighway" <no-reply@goalhighway.com>', // sender address
    to: email, // list of receivers
    subject: 'Verify your account at GoalHighway', // Subject line
    text: 'click here', // plaintext body
    html: confirmEmailTemplate('http://www.goalhighway.com')
  };

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
      [1, 2, 3, 4, 5, 6].includes(user_year) &&
      req.body.instId &&
      req.body.progId
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const findInstProgId = trx => knex('institution_program')
    .transacting(trx)
    .select('id')
    .where('inst_id', req.body.instId)
    .andWhere('prog_id', req.body.progId)
    .whereNull('deleted_at');

  const insertNewUser = (newUserObj, trx) => knex('users')
    .transacting(trx)
    .insert(newUserObj);

  knex.transaction(trx => {
    validateInputs()
    .then(() => Promise.all([ bcrypt.hash(pwd, 10), findInstProgId(trx) ]))
    .then(results => {
      const newUserObj = {
        username,
        email,
        password: results[0],
        user_year,
        inst_prog_id: results[1][0].id
      };
      return insertNewUser(newUserObj, trx);
    })
    .then(() => mailer.sendMail(mailOptions))
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside postNewUser.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

  // validateInputs()
  // .then(() => Promise.all([ bcrypt.hash(pwd, 10), findInstProgId() ]))
  // .then(results => insertNewUser({
  //   username,
  //   email,
  //   password: results[0],
  //   user_year,
  //   inst_prog_id: results[1][0].id
  // }))
  // .then(() => res.send(true))
  // .catch(err => {
  //   console.error('Error inside postNewUser.js: ', err);
  //   res.send(false);
  // });

};

module.exports = postNewUser;
