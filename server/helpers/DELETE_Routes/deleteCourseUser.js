const deleteCourseUser = (req, res, knex, user_id) => {

  const voidOutstandingAssistRequests = () => knex('tutor_log')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .update({
      closed_at: knex.fn.now(),
      closure_reason: 'system_void_unsubscribed'
    }).returning('id');

  const deleteAssistNotif = (tutor_log_id) => knex('notifications').where('tutor_log_id', tutor_log_id).del();

  const deleteCourseFeed = (tutor_log_id) => knex('course_feed').where('tutor_log_id', tutor_log_id).del();

  const unsubscribeCourseUser = () => knex('course_user')
    .where('course_id', req.params.course_id)
    .andWhere('user_id', user_id)
    .update({
      sub_date: null,
      tutor_status: false,
      tutor_available: false,
      unsub_date: knex.fn.now(),
      unsub_reason: 'some_reason'
    });

  Promise.all([
    voidOutstandingAssistRequests(),
    unsubscribeCourseUser()
  ]).then(results => {
    res.send(true);
    return Promise.all([
      deleteCourseFeed(results[0][0] || 0),
      deleteAssistNotif(results[0][0] || 0)
    ]);
  }).catch(err => {
    console.error("Error inside deleteCourseUser.js: ", err);
    res.send(false);
  });

};

module.exports = deleteCourseUser;
