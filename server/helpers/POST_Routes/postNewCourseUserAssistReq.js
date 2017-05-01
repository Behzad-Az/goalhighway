const postNewCourseUserAssistReq = (req, res, knex, user_id) => {

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      req.params.course_id &&
      req.body.issueDesc.trim() && req.body.issueDesc.trim().length <= 500
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

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

  const insertNewTutorLog = (tutorLogObj, trx) => knex('tutor_log')
    .transacting(trx)
    .insert(tutorLogObj)
    .returning('id');

  const addCourseFeed = (courseFeedObj, trx) => knex('course_feed')
    .transacting(trx)
    .insert(courseFeedObj);

  const verifySubscription = trx => knex('course_user')
    .transacting(trx)
    .where('course_id', req.params.course_id)
    .andWhere('user_id', user_id)
    .whereNotNull('sub_date')
    .whereNull('unsub_date')
    .limit(1)
    .count('id as subscribed');

  knex.transaction(trx => {
    Promise.all([validateInputs(), verifySubscription(trx)])
    .then(results => {
      if (parseInt(results[1][0].subscribed)) {
        return closePrevReqIfNecessary();
      } else {
        throw 'User not subscribed to course';
      }
    })
    .then(() => {
      let tutorLogObj = {
        student_id: user_id,
        course_id: req.params.course_id,
        issue_desc: req.body.issueDesc.trim()
      };
      return insertNewTutorLog(tutorLogObj, trx);
    })
    .then(tutorLogId => {
      let newCourseFeed = {
        anonymous: false,
        commenter_id: user_id,
        category: 'new_tutor_request',
        header: 'new_tutor_request',
        content: req.body.issueDesc.trim(),
        course_id: req.params.course_id,
        tutor_log_id: tutorLogId[0]
      };
      return addCourseFeed(newCourseFeed, trx);
    })
    .then(() => trx.commit())
    .catch(err => {
      console.error('Error inside postNewCourseUserAssistReq.js: ', err);
      trx.rollback();
    });
  })
  .then(() => res.send(true))
  .catch(() => res.send(false));

};

module.exports = postNewCourseUserAssistReq;
