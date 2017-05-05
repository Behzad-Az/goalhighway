const updateCourseUserTutorStatus = (req, res, knex, user_id) => {

  const validateInputs = () => new Promise ((resolve, reject) => {
    [true, false].includes(req.body.tutorStatus) && req.params.course_id ? resolve() : reject('Invalid form entries');
  });

  const toggleTutorStatus = () => knex('course_user')
    .where('course_id', req.params.course_id)
    .andWhere('user_id', user_id)
    .whereNotNull('sub_date')
    .whereNull('unsub_date')
    .whereNull('unsub_reason')
    .update({ tutor_status: req.body.tutorStatus });

  validateInputs()
  .then(() => toggleTutorStatus())
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateCourseUserTutorStatus.js: ', err);
    res.send(false);
  });

};

module.exports = updateCourseUserTutorStatus;
