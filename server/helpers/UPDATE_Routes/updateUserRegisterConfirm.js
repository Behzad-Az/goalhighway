const updateUserRegisterConfirm = (req, res, knex) => {

  const confirmUserRegister = () => knex('users')
    .where('confirmed', false)
    .andWhere('register_token', req.body.registerToken)
    .andWhere('email', req.body.email)
    .whereNull('deleted_at')
    .update({ confirmed: true });

  confirmUserRegister()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateUserRegisterConfirm.js: ', err);
    res.send(false);
  });

};

module.exports = updateUserRegisterConfirm;
