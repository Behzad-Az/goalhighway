const updateCourseUserTutorStatus = (req, res, knex, user_id) => {

  let tutorStatusObj = { tutor_status: req.body.tutorStatus };

  const getCourseUserInfo = () => knex('course_user').where('course_id', req.params.course_id).andWhere('user_id', user_id);

  getCourseUserInfo().then(rows => {
    let courseUserInfo = rows[0];
    if (courseUserInfo && courseUserInfo.sub_date) {
      return knex('course_user').where('id', courseUserInfo.id).update(tutorStatusObj);
    } else {
      throw "User must be subscribed before updating tutor status";
    }
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error("Error inside updateCourseUserTutorStatus.js 2: ", err);
    res.send(false);
  });

};

module.exports = updateCourseUserTutorStatus;
