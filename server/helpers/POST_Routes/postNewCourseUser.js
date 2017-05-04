const postNewCourseUser = (req, res, knex, user_id) => {

  validateInputs = () => new Promise((resolve, reject) => {
    req.params.course_id ? resolve() : reject('Invalid parameter');
  });

  const userAlreadySubscribed = () => knex('course_user')
    .where('user_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('unsub_date')
    .whereNull('unsub_reason')
    .count('id as subscribed');

  const insertNewCourseUser = newCourseUserObj => knex('course_user')
    .insert(newCourseUserObj);

  validateInputs()
  .then(() => userAlreadySubscribed())
  .then(result => {
    if (parseInt(result[0].subscribed)) {
      throw 'user already subscribed';
    } else {
      return insertNewCourseUser({
        user_id,
        course_id: req.params.course_id
      });
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourseUser.js: ', err);
    res.send(false);
  });

};

module.exports = postNewCourseUser;
