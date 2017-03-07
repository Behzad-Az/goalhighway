const postNewCourseUserAssistReq = (req, res, knex, user_id) => {

  let tutor_log = {
    student_id: user_id,
    course_id: req.params.course_id,
    issue_desc: req.body.issue_desc
  };

  const closePrevReqIfNecessary = () => knex('tutor_log')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .update({
      tutor_id: null,
      closure_reason: 'system_void',
      closed_at: knex.fn.now(),
      feedback: null,
      rating: null
    });

  const getUserInfo = () => knex('users').select('id', 'username').where('id', user_id);
  const insertNewTutorLog = () => knex('tutor_log').insert(tutor_log).returning('id');
  const insertRelatedCourseFeed = courseFeedObj => knex('course_feed').insert(courseFeedObj);
  const getAllCourseTutors = () => knex('course_user').select('user_id').where('course_id', req.params.course_id).andWhere('tutor_status', true);

  const insertTutorNotif = (to_id, notifObj) => {
    let obj = Object.assign({}, notifObj, { to_id: to_id });
    return knex('notifications').insert(obj);
  };

  closePrevReqIfNecessary()
  .then(() => {
   return Promise.all([
      getUserInfo(),
      insertNewTutorLog(),
      getAllCourseTutors()
    ]);
  }).then(results => {
    res.send(true);

    let courseTutorIds = results[2].map(user => user.user_id);
    let newTutorLogId = results[1][0];
    let userInfo = results[0][0];

    let newCourseFeed = {
      commenter_name: userInfo.username,
      category: "tutor_request",
      content: `Requesting peer tutoring: ${req.body.issue_desc}`,
      course_id: req.params.course_id,
      user_id: user_id,
      tutor_log_id: newTutorLogId
    };

    insertRelatedCourseFeed(newCourseFeed).then(() => {}).catch(err => console.error("Error inside postNewCourseUserAssistReq.js - insertRelatedCourseFeed: ", err));

    let notifObj = {
      from_id: user_id,
      course_id: req.params.course_id,
      tutor_log_id: newTutorLogId,
      category: "tutor_request",
      content: `Requesting peer tutoring: ${req.body.issue_desc}`,
    };

    let promiseArr = courseTutorIds.map(tutor_id => insertTutorNotif(tutor_id, notifObj));
    Promise.all(promiseArr).then(() => {}).catch(err => console.error("Error inside postNewCourseUserAssistReq.js - insertTutorNotif: ", err));

  }).catch(err => {
    console.error("Error inside postNewCourseUserAssistReq.js: ", err);
    res.send(false);
  });
};

module.exports = postNewCourseUserAssistReq;
