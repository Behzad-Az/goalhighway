const deleteCourseUser = (req, res, knex, user_id) => {

  const voidOutstandingAssistRequests = trx => knex('tutor_log')
    .transacting(trx)
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .whereNull('closure_reason')
    .update({
      closed_at: knex.fn.now(),
      closure_reason: 'system_void_unsubscribed'
    })
    .returning('id');

  const deleteCourseFeed = (tutor_log_id, trx) => knex('course_feed')
    .transacting(trx)
    .where('category', 'new_tutor_request')
    .andWhere('tutor_log_id', tutor_log_id)
    .andWhere('commenter_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .del();

  const unsubscribeCourseUser = trx => knex('course_user')
    .transacting(trx)
    .where('course_id', req.params.course_id)
    .andWhere('user_id', user_id)
    .whereNull('unsub_date')
    .whereNull('unsub_reason')
    .update({
      tutor_status: false,
      tutor_available: false,
      unsub_date: knex.fn.now(),
      unsub_reason: 'default_unsub_reason'
    });

  knex.transaction(trx => {
    Promise.all([ voidOutstandingAssistRequests(trx), unsubscribeCourseUser(trx) ])
    .then(results => results[0][0] ? deleteCourseFeed(results[0][0], trx) : 0)
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside deleteCourseUser.js', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(err => res.send(false));

};

module.exports = deleteCourseUser;
