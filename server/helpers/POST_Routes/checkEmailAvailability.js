const checkEmailAvailability = (req, res, knex, user_id) => {
  knex('users').where('email', req.body.email).count('email as taken')
  .then(status => parseInt(status[0].taken) ? res.send(false) : res.send(true))
  .catch(err => {
    console.error('Error inside checkEmailAvailability.js: ', err);
    res.send(false);
  });

};

module.exports = checkEmailAvailability;
