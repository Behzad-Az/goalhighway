const postNewCourseUserAssistReq = (req, res, knex, user_id) => {

  const issue_desc = req.body.issueDesc.trim();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      issue_desc.length >= 4 && issue_desc.length <= 500 &&
      issue_desc.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      req.params.course_id
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
    .whereNull('unsub_reason')
    .limit(1)
    .count('id as subscribed');

  knex.transaction(trx => {
    validateInputs()
    .then(() => verifySubscription(trx))
    .then(result => {
      if (parseInt(result[0].subscribed)) {
        return closePrevReqIfNecessary();
      } else {
        throw 'User not subscribed to course';
      }
    })
    .then(() => {
      let tutorLogObj = {
        student_id: user_id,
        course_id: req.params.course_id,
        issue_desc
      };
      return insertNewTutorLog(tutorLogObj, trx);
    })
    .then(tutorLogId => {
      let newCourseFeed = {
        anonymous: false,
        commenter_id: user_id,
        category: 'new_tutor_request',
        header: 'new_tutor_request',
        content: issue_desc,
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
