const postNewCourseUserAssistReq = (req, res, knex, user_id) => {

  let tutorLogObj = {
    student_id: user_id,
    course_id: req.params.course_id,
    issue_desc: req.body.issueDesc
  };

  let newTutorLogId, courseTutorIds;

  const closePrevReqIfNecessary = trx => knex('tutor_log')
    .transacting(trx)
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

  const getUserInfo = () => knex('users')
    .select('id', 'username')
    .where('id', user_id);

  const insertNewTutorLog = trx => knex('tutor_log')
    .transacting(trx)
    .insert(tutorLogObj)
    .returning('id');

  const insertRelatedCourseFeed = (courseFeedObj, trx) => knex('course_feed')
    .transacting(trx)
    .insert(courseFeedObj);

  const getAllCourseTutors = () => knex('course_user').select('user_id').where('course_id', req.params.course_id).andWhere('tutor_status', true);

  const insertTutorNotif = (to_id, notifObj, trx) => {
    notifObj.to_id = to_id;
    return knex('notifications')
      .transacting(trx)
      .insert(notifObj);
  };

  knex.transaction(trx => {
    closePrevReqIfNecessary(trx)
    .then(() => Promise.all([ getUserInfo(), insertNewTutorLog(trx), getAllCourseTutors() ]))
    .then(results => {
      newTutorLogId = results[1][0];
      courseTutorIds = results[2].map(tutor => tutor.user_id);
      let userInfo = results[0][0];
      let newCourseFeed = {
        commenter_name: userInfo.username,
        commenter_id: user_id,
        category: 'tutor_request',
        content: `Requesting peer tutoring: ${req.body.issueDesc}`,
        course_id: req.params.course_id,
        tutor_log_id: newTutorLogId
      };
      return insertRelatedCourseFeed(newCourseFeed, trx);
    })
    .then(() => {
      let notifObj = {
        from_id: user_id,
        course_id: req.params.course_id,
        tutor_log_id: newTutorLogId,
        category: 'tutor_request',
        content: `Requesting peer tutoring: ${req.body.issueDesc}`,
      };
      let promiseArr = courseTutorIds.map(tutorId => insertTutorNotif(tutorId, notifObj, trx));
      return Promise.all(promiseArr);
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewCourseUserAssistReq.js', err);
    res.send(false);
  });

};

module.exports = postNewCourseUserAssistReq;
