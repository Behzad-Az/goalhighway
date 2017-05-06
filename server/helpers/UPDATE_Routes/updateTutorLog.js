const updateTutorLog = (req, res, knex, user_id) => {

  // const issue_desc = req.body.issueDesc.trim();

  // const validateInputs = () => new Promise((resolve, reject) => {
  //   if (
  //     issue_desc.length >= 4 && issue_desc.length <= 500 &&
  //     issue_desc.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
  //     ['close', 'update'].includes(req.body.action)
  //     req.params.course_id
  //   ) {
  //     resolve();
  //   } else {
  //     reject('Invalid form entries');
  //   }
  // });

  let tutorLogObj;

  if (req.body.action === 'close') {
    tutorLogObj = {
      closure_reason: req.body.closureReason,
      closed_at: knex.fn.now()
    };
  } else if (req.body.action === 'update') {
    tutorLogObj = {
      issue_desc: req.body.issueDesc
    };
  }

  const updateCourseFeed = tutor_log_id => knex('course_feed')
    .where('tutor_log_id', tutor_log_id)
    .update({ content: `Requesting peer tutoring: ${req.body.issueDesc}` });

  const deleteCourseFeed = tutor_log_id => knex('course_feed')
    .where('tutor_log_id', tutor_log_id)
    .del();

  const alterTutorLog = () => knex('tutor_log')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .update(tutorLogObj)
    .returning('id');

  alterTutorLog()
  .then(id => req.body.action === 'close' ? deleteCourseFeed(id[0]) : updateCourseFeed(id[0]))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateTutorLog.js: ', err);
    res.send(false);
  });

};

module.exports = updateTutorLog;
