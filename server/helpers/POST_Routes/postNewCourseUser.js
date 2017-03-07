const postNewCourseUser = (req, res, knex, user_id) => {
  let courseUserInfo = {
    user_id: user_id,
    course_id: req.params.course_id,
    sub_date: knex.fn.now(),
    tutor_status: false,
    tutor_available: false,
    unsub_date: null,
    unsub_reason: null
  };

  const userAlreadyHasRow = () => knex('course_user').select('id').where('user_id', user_id).andWhere('course_id', req.params.course_id);

  const insertOrUpdateCourseUser = (cousrse_user_id) => {
    return cousrse_user_id ? knex('course_user').where('id', cousrse_user_id.id).update(courseUserInfo).returning('id') : knex('course_user').insert(courseUserInfo).returning('id');
  }

  userAlreadyHasRow()
  .then(result => insertOrUpdateCourseUser(result[0]))
  .then(id => res.send(true))
  .catch(err => {
    console.error("Error inside postNewCourseUser.js: ", err);
    res.send(false);
  });

};

module.exports = postNewCourseUser;
