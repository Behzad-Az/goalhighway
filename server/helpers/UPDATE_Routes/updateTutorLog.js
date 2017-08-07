const updateTutorLog = (req, res, knex, user_id) => {

  const issue_desc = req.body.issueDesc.trim();
  const action = req.body.action;
  const closure_reason = req.body.closureReason;
  let tutorLogObj;

  if (action === 'close') {
    tutorLogObj = {
      closure_reason,
      closed_at: knex.fn.now()
    };
  } else if (action === 'update') {
    tutorLogObj = {
      issue_desc
    };
  }

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      issue_desc.length >= 4 && issue_desc.length <= 500 &&
      issue_desc.search(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/) == -1 &&
      ['close', 'update'].includes(action) &&
      ['', 'Resolved on my own', 'Resolved with tutor', 'No longer needed', 'Other'].includes(closure_reason) &&
      req.params.course_id
    ) {
      resolve();
    } else {
      reject('Invalid form entries');
    }
  });

  const updateCourseFeed = tutor_log_id => knex('course_feed')
    .where('tutor_log_id', tutor_log_id)
    .andWhere('commenter_id', user_id)
    .update({ content: `Requesting peer tutoring: ${issue_desc}` });

  const deleteCourseFeed = tutor_log_id => knex('course_feed')
    .where('tutor_log_id', tutor_log_id)
    .del();

  const alterTutorLog = () => knex('tutor_log')
    .where('student_id', user_id)
    .andWhere('course_id', req.params.course_id)
    .whereNull('closed_at')
    .update(tutorLogObj)
    .returning('id');

  validateInputs()
  .then(() => alterTutorLog())
  .then(id => action === 'close' ? deleteCourseFeed(id[0]) : updateCourseFeed(id[0]))
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside updateTutorLog.js: ', err);
    res.send(false);
  });

};

module.exports = updateTutorLog;
