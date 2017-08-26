const updateUserPassword = (req, res, knex, bcrypt) => {

  const pwd = req.body.password.trim();
  const pwdConfirm = req.body.passwordConfirm.trim();
  const email = req.body.email;
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  const requestId = req.body.requestId;
  let foundRequest;

  const validateInputs = () => new Promise ((resolve, reject) => {
    if (
      pwd === pwdConfirm &&
      pwd.length >= 6 && pwd.length <= 30 &&
      pwd.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) == -1 &&
      pwd.search(/\d/) != -1 &&
      pwd.search(/[a-zA-Z]/) != -1 &&
      email.length >= 6 && email.length <= 30 &&
      email.match(emailRegex) &&
      requestId.length === 11
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const verifyPswdResetRequest = () => knex('password_change_requests')
    .select('id', 'user_id')
    .where({ email })
    .whereRaw("created_at > current_timestamp - interval '1 day'")
    .orderBy('created_at', 'desc')
    .limit(1);

  const updatePassword = (userId, password) => knex('users')
    .where('id', userId)
    .update({ password });

  validateInputs()
  .then(() => verifyPswdResetRequest())
  .then(request => {
    if (request[0]) {
      foundRequest = request[0];
      return bcrypt.compare(requestId, foundRequest.id);
    } else {
      throw 'Invalid password reset request. Given email not found or expired link';
    }
  })
  .then(valid => {
    if (valid) {
      return bcrypt.hash(pwd, 10);
    } else {
      throw 'Invalid password reset request. Given request id not found';
    }
  })
  .then(password => updatePassword(foundRequest.user_id, password))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateUserPassword.js: ', err);
    res.send(false);
  });

  // knex.transaction(trx => {
  //   validateInputs()
  //   .then(() => Promise.all([ bcrypt.hash(pwd, 10), findInstProgId(trx) ]))
  //   .then(results => {
  //     const newUserObj = {
  //       id: randIdString(11),
  //       username,
  //       email,
  //       password: results[0],
  //       user_year,
  //       inst_prog_id: results[1][0].id,
  //       register_token,
  //       confirmed: true
  //     };
  //     return insertNewUser(newUserObj, trx);
  //   })
  //   // .then(() => mailer.sendMail(mailOptions))
  //   .then(() => trx.commit())
  //   .catch(err => {
  //     console.error('Error inside updateUserPassword.js: ', err);
  //     trx.rollback();
  //   });
  // })
  // .then(() => res.send(true))
  // .catch(() => res.send(false));

};

module.exports = updateUserPassword;
