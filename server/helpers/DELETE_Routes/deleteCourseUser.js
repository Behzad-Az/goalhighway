const deleteCourseUser = (req, res, knex, user_id) => {

  const voidOutstandingAssistRequests = trx => knex('tutor_log')
    .transacting(trx)
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .update({
      closed_at: knex.fn.now(),
      closure_reason: 'system_void_unsubscribed'
    })
    .returning('id');

  const deleteAssistNotif = (tutor_log_id, trx) => knex('notifications')
    .transacting(trx)
    .where('tutor_log_id', tutor_log_id)
    .del();

  const deleteCourseFeed = (tutor_log_id, trx) => knex('course_feed')
    .transacting(trx)
    .where('tutor_log_id', tutor_log_id)
    .del();

  const unsubscribeCourseUser = trx => knex('course_user')
    .transacting(trx)
    .where('course_id', req.params.course_id)
    .andWhere('user_id', user_id)
    .update({
      sub_date: null,
      tutor_status: false,
      tutor_available: false,
      unsub_date: knex.fn.now(),
      unsub_reason: 'some_reason'
    });

  knex.transaction(trx => {
    Promise.all([ voidOutstandingAssistRequests(trx), unsubscribeCourseUser(trx) ])
    .then(results => Promise.all([ deleteCourseFeed(results[0][0] || 0), deleteAssistNotif(results[0][0] || 0) ]))
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside deleteCourseUser.js', err);
    res.send(false);
  });

};

module.exports = deleteCourseUser;
