const checkUsernameAvailability = (req, res, knex, user_id) => {
  knex('users').where('username', req.body.username).count('username as taken').then(status => {
    parseInt(status[0].taken) ? res.send(false) : res.send(true);
  });
};

module.exports = checkUsernameAvailability;
