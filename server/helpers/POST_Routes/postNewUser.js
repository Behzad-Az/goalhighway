const confirmEmailTemplate = require('../Email_Templates/confirmEmailTemplate.js');
const randIdString = require('random-base64-string');

const postNewUser = (req, res, knex, bcrypt, mailer) => {

  const username = req.body.username.trim().toLowerCase();
  const pwd = req.body.password.trim();
  const pwdConfirm = req.body.passwordConfirm.trim();
  const email = req.body.email.trim().toLowerCase();
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  const user_year = parseInt(req.body.userYear);
  const register_token = Math.random().toString(36).substr(2, 15);

  const mailOptions = {
    from: '"GoalHighway" <no-reply@goalhighway.com>', // sender address
    to: email,
    subject: 'Verify your account at GoalHighway', // Subject line
    text: 'Welcome to GoalHighway!', // plaintext body
    html: confirmEmailTemplate(`http://localhost:3000/confirm_register?token=${register_token}&email=${email}`)
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
        id: randIdString(11),
        username,
        email,
        password: results[0],
        user_year,
        inst_prog_id: results[1][0].id,
        register_token,
        confirmed: true
      };
      return insertNewUser(newUserObj, trx);
    })
    // .then(() => mailer.sendMail(mailOptions))
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside postNewUser.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewUser;
