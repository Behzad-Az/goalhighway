const updateCourseUserTutorStatus = (req, res, knex, user_id) => {

  const alterTutorStatus = () => knex('course_user')
    .where('course_id', req.params.course_id)
    .andWhere('user_id', user_id)
    .whereNotNull('sub_date')
    .whereNull('unsub_date')
    .update({ tutor_status: req.body.tutorStatus });

  alterTutorStatus()
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateCourseUserTutorStatus.js: ', err);
    res.send(false);
  });

};

module.exports = updateCourseUserTutorStatus;
