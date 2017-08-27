const resetPasswordTemplate = require('../Email_Templates/resetPasswordTemplate.js');

const postNewPasswordChangeRequest = (req, res, knex, bcrypt, mailer, randIdString) => {

  const usernameOrEmail = req.body.usernameOrEmail.trim().toLowerCase();
  const requestId = randIdString(11);
  let foundUser;

  const findUserId = () => knex('users')
    .select('id', 'username', 'email')
    .where(function() { this.where('username', usernameOrEmail).orWhere('email', usernameOrEmail) })
    .whereNull('deleted_at');

  const insertNewPswdChangeReq = newPswdChangeReqObj => knex('password_change_requests')
    .insert(newPswdChangeReqObj);

  findUserId()
  .then(user => {
    if (user[0]) {
      foundUser = user[0];
      return bcrypt.hash(requestId, 10);
    } else {
      throw 'Could not find the user in the pg db';
    }
  })
  .then(id => insertNewPswdChangeReq({ id, user_id: foundUser.id, email: foundUser.email }))
  .then(() => mailer.sendMail({
    from: '"GoalHighway" <no-reply@goalhighway.com>', // sender address
    to: foundUser.email,
    subject: 'Forgot Account - GoalHighway', // Subject line
    text: 'Forgot account', // plaintext body
    html: resetPasswordTemplate(`https://goalhighway.com/reset_password?requestId=${requestId}&email=${foundUser.email}`, foundUser.username)
    // html: resetPasswordTemplate(`http://localhost:3000/reset_password?requestId=${requestId}&email=${foundUser.email}`, foundUser.username)
  }))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewPasswordChangeRequest.js: ', err);
    res.send(false);
  });

};

module.exports = postNewPasswordChangeRequest;
