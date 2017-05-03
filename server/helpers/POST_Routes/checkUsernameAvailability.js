const checkUsernameAvailability = (req, res, knex, user_id) => {
  knex('users').where('username', req.body.username.trim().toLowerCase()).count('username as taken')
  .then(status => parseInt(status[0].taken) ? res.send(false) : res.send(true))
  .catch(err => {
    console.error('Error inside checkUsernameAvailability.js: ', err);
    res.send(false);
  });

};

module.exports = checkUsernameAvailability;
